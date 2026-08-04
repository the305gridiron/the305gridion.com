import { DEFAULT_ROSTER } from "@/constants/rosterData";

export const POSITION_NAMES = {
    LWR: "Left Wide Receiver (LWR)",
    RWR: "Right Wide Receiver (RWR)",
    SWR: "Slot Wide Receiver (SWR)",
    LT: "Left Tackle (LT)",
    LG: "Left Guard (LG)",
    C: "Center (C)",
    RG: "Right Guard (RG)",
    RT: "Right Tackle (RT)",
    TE: "Tight End (TE)",
    QB: "Quarterback (QB)",
    RB: "Running Back (RB)",
    FB: "Fullback (FB)",
    LDE: "Left Defensive End (LDE)",
    LDT: "Left Defensive Tackle (LDT)",
    RDT: "Right Defensive Tackle (RDT)",
    RDE: "Right Defensive End (RDE)",
    WLB: "Will Linebacker (WLB)",
    MLB: "Mike Linebacker (MLB)",
    LCB: "Left Cornerback (LCB)",
    RCB: "Right Cornerback (RCB)",
    NB: "Nickelback (NB)",
    SS: "Strong Safety (SS)",
    FS: "Free Safety (FS)",
    PK: "Place Kicker (PK)",
    PT: "Punter (PT)",
    LS: "Long Snapper (LS)",
};

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
        "RT"
    ],
    defense: [
        "LDE",
        "LDT",
        "RDT",
        "RDE",
        "WLB",
        "MLB",
        "LCB",
        "RCB",
        "NB",
        "SS",
        "FS",
    ],
    special: ["PK", "PT", "LS"],
};

export const VIEW_TABS = ["offense", "defense", "special", "all"];
export const DEPTH_COLUMNS = [0, 1, 2, 3, 4, 5];

export const SORTABLE_COLUMNS = [
    { key: "number", label: "#" },
    { key: "name", label: "PLAYER" },
    { key: "position", label: "POS" },
    { key: "height", label: "HT" },
    { key: "weight", label: "WT" },
    { key: "age", label: "AGE" },
    { key: "exp", label: "EXP" },
    { key: "college", label: "COLLEGE" },
];

export const getInitialDepthChart = () => {
    const initial = {};
    const allPositions = [
        ...DEPTH_POSITIONS_ORDER.offense,
        ...DEPTH_POSITIONS_ORDER.defense,
        ...DEPTH_POSITIONS_ORDER.special,
    ];

    allPositions.forEach((position) => {
        initial[position] = [];
    });

    DEFAULT_ROSTER.forEach((player) => {
        if (initial[player.depthPosition]) {
            initial[player.depthPosition].push(player);
        }
    });

    return initial;
};

export const normalizeRosterState = (savedRoster) => {
    const initial = getInitialDepthChart();

    if (!savedRoster || typeof savedRoster !== "object") {
        return initial;
    }

    const normalized = { ...initial, ...savedRoster };
    Object.keys(initial).forEach((position) => {
        if (!Array.isArray(normalized[position])) {
            normalized[position] = initial[position];
        }
    });

    return normalized;
};

export const getNumberValue = (num) => {
    const val = parseInt(num, 10);
    return Number.isNaN(val) ? 999 : val;
};

export const getAgeValue = (age) => {
    if (age === null || age === undefined || Number.isNaN(age)) return 99;
    return age;
};

export const getExpValue = (exp) => {
    if (exp === "R" || exp === "Rook") return 0;
    const val = parseInt(exp, 10);
    return Number.isNaN(val) ? 0 : val;
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
    } else {
        const positionsInTab = DEPTH_POSITIONS_ORDER[activeTab] || [];
        filtered = players.filter((player) =>
            positionsInTab.includes(player.depthPosition),
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
