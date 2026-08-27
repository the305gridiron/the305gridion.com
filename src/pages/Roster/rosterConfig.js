// Season year used to compute years of experience from draft_year.
// Bump this once a year — same manual-update pattern as the hardcoded
// `year === 2026` filter on the Schedule page.
export const CURRENT_SEASON_YEAR = 2026;

export const DEPTH_POSITIONS_ORDER = {
    offense: [
        "QB",
        "RB",
        "FB",
        "LWR",
        "RWR",
        "SWR",
        "TE",
        "LT",
        "LG",
        "C",
        "RG",
        "RT",
    ],
    defense: [
        "LDE",
        "LDT",
        "RDT",
        "RDE",
        "WLB",
        "MLB",
        "SLB",
        "LCB",
        "RCB",
        "NB",
        "SS",
        "FS",
    ],
    special: ["K", "P", "LS"],
    inactive: ["PS", "NFI", "PUP", "IR", "Retired"]
};

export const VIEW_TABS = ["all", "offense", "defense", "special", "inactive"];
export const DEPTH_COLUMNS = [0, 1, 2, 3, 4, 5];

export const SORTABLE_COLUMNS = [
    { key: "number", label: "#" },
    { key: "name", label: "PLAYER" },
    { key: "status", label: "STATUS" },
    { key: "position", label: "POS" },
    { key: "height", label: "HT" },
    { key: "weight", label: "WT" },
    { key: "age", label: "AGE" },
    { key: "exp", label: "EXP" },
    { key: "college", label: "COLLEGE" },
];

export function getSchoolById(schools, id) {
    if (!schools || id === null || id === undefined) return null;
    return schools.find((school) => school.id === id) || null;
}

// Age from a date of birth, accounting for whether this year's birthday
// has actually happened yet.
export function calculateAge(dob) {
    if (!dob) return null;

    const birthDate = new Date(dob);
    if (Number.isNaN(birthDate.getTime())) return null;

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();

    const hasHadBirthdayThisYear =
        today.getMonth() > birthDate.getMonth() ||
        (today.getMonth() === birthDate.getMonth() &&
            today.getDate() >= birthDate.getDate());

    if (!hasHadBirthdayThisYear) age -= 1;

    return age;
}

// Years of NFL experience from draft_year. Returns null when draft_year is
// missing — some undrafted players won't have one, and there's no reliable
// way to derive real experience from this field alone in that case.
export function calculateExperience(draftYear) {
    if (!draftYear) return null;
    return Math.max(CURRENT_SEASON_YEAR - draftYear, 0);
}

// "R" for rookies (0 years), a plain number otherwise, "-" when unknown.
// Matches the display convention DatabaseTable/DepthChartTable already use.
export function formatExperience(expYears) {
    if (expYears === null || expYears === undefined) return "-";
    return expYears === 0 ? "R" : expYears;
}

// Builds the enriched shape DepthChartTable/DatabaseTable expect, from a
// raw players-table row + the schools list for the college join.
export function buildPlayerRecord(player, school) {
    const expYears = calculateExperience(player.draft_year);

    return {
        id: player.id,
        number: player.number,
        name: player.name,
        height: player.height,
        weight: player.weight,
        position: player.position,
        depthPosition: player.depth_position,
        depthOrder: player.depth_order,
        age: calculateAge(player.dob),
        exp: formatExperience(expYears),
        college: school?.full_name || "-",
        image: player.image,
        status: player.status,
    };
}

// Depth positions renamed since some players were last saved in Xano —
// maps the old value to its current DEPTH_POSITIONS_ORDER key so existing
// records still slot into the right column without a data migration.
const LEGACY_DEPTH_POSITION_ALIASES = {
    LOLB: "WLB",
    ROLB: "SLB",
};

function normalizeDepthPosition(depthPosition) {
    return LEGACY_DEPTH_POSITION_ALIASES[depthPosition] ?? depthPosition;
}

// Groups active players by depth_position for the depth chart, sorted by
// depth_order. Players with no depth_order set (nullable, e.g. someone not
// currently in the rotation) sort to the end of their position group rather
// than defaulting to a fake starter slot. Inactive-status players (PS/NFI/
// PUP/IR/Retired) aren't part of any depth chart position group — they only
// ever appear in the "inactive" tab's database view.
export function groupPlayersByDepthPosition(players) {
    const grouped = {};
    const allPositions = [
        ...DEPTH_POSITIONS_ORDER.offense,
        ...DEPTH_POSITIONS_ORDER.defense,
        ...DEPTH_POSITIONS_ORDER.special,
    ];

    allPositions.forEach((position) => {
        grouped[position] = [];
    });

    players.forEach((player) => {
        const depthPosition = normalizeDepthPosition(player.depthPosition);
        if (grouped[depthPosition]) {
            grouped[depthPosition].push(player);
        }
    });

    Object.keys(grouped).forEach((position) => {
        grouped[position].sort((a, b) => {
            // Use depthOrder (camelCase)
            const aOrder = a.depthOrder ?? Number.MAX_SAFE_INTEGER;
            const bOrder = b.depthOrder ?? Number.MAX_SAFE_INTEGER;
            return aOrder - bOrder;
        });
    });

    return grouped;
}

export const getNumberValue = (num) => {
    const val = parseInt(num, 10);
    return Number.isNaN(val) ? 999 : val;
};

export const getAgeValue = (age) => {
    if (age === null || age === undefined || Number.isNaN(age)) return 99;
    return age;
};

export const getExpValue = (exp) => {
    if (exp === "R") return 0;
    if (exp === "-") return 999;
    const val = parseInt(exp, 10);
    return Number.isNaN(val) ? 999 : val;
};

export const getWeightValue = (wt) => {
    const val = parseInt(wt, 10);
    return Number.isNaN(val) ? 0 : val;
};

export const normalizeSearchQuery = (query = "") => query.trim().toLowerCase();

export const matchesSearchQuery = (player, searchQuery) => {
    if (!searchQuery) return true;

    const query = normalizeSearchQuery(searchQuery);
    if (!query) return true;

    return [player.name, player.college, player.position, player.number].some(
        (value) => String(value).toLowerCase().includes(query),
    );
};

export const filterAndSortPlayers = ({
    players,
    activeTab,
    searchQuery,
    sortConfig,
}) => {
    let filtered = [];

    if (activeTab === "all") {
        filtered = players;
    } else if (activeTab === "inactive") {
        const inactiveStatuses = DEPTH_POSITIONS_ORDER.inactive;

        filtered = players.filter((player) =>
            inactiveStatuses.includes(player.status),
        );
    } else {
        const positionsInTab = DEPTH_POSITIONS_ORDER[activeTab] || [];

        filtered = players.filter((player) =>
            positionsInTab.includes(normalizeDepthPosition(player.depthPosition)),
        );
    }

    if (searchQuery.trim()) {
        filtered = filtered.filter((player) =>
            matchesSearchQuery(player, searchQuery),
        );
    }

    if (sortConfig.key) {
        filtered = [...filtered].sort((a, b) => {
            let comparison = 0;
            const { key, direction } = sortConfig;

            if (key === "number") {
                comparison =
                    getNumberValue(a.number) - getNumberValue(b.number);
            } else if (key === "name") {
                comparison = a.name.localeCompare(b.name);
            } else if (key === "position") {
                comparison = a.position.localeCompare(b.position);
            } else if (key === "age") {
                comparison = getAgeValue(a.age) - getAgeValue(b.age);
            } else if (key === "exp") {
                comparison = getExpValue(a.exp) - getExpValue(b.exp);
            } else if (key === "weight") {
                comparison =
                    getWeightValue(a.weight) - getWeightValue(b.weight);
            } else if (key === "college") {
                comparison = a.college.localeCompare(b.college);
            } else if (key === "height") {
                comparison = a.height.localeCompare(b.height);
            }

            return direction === "asc" ? comparison : -comparison;
        });
    }

    return filtered;
};