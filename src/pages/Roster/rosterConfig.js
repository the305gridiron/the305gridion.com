// Season year used to compute years of experience from draft_year.
// Bump this once a year — same manual-update pattern as the hardcoded
// `year === 2026` filter on the Schedule page.
export const CURRENT_SEASON_YEAR = 2026;

export const DEPTH_POSITIONS_ORDER = {
  offense: [
    "QB",
    "RB",
    "FB",
    "WR1",
    "WR2",
    "WR3",
    "TE",
    "LT",
    "LG",
    "C",
    "RG",
    "RT",
  ],
  defense: [
    "EDGE1",
    "EDGE2",
    "DT1",
    "DT2",
    "ILB1",
    "ILB2",
    "NB",
    "CB1",
    "CB2",
    "S1",
    "S2",
  ],
  special: ["K", "P", "LS"],
};

// Matches the "status" enum on the players table. Not a depth position —
// these players skip the depth chart entirely and show in a flat database
// view instead (see Roster.jsx / RosterControls.jsx). Practice squad is
// deliberately not in this list — those players are still worth showing to
// fans, just not on the active-roster depth chart (see PRACTICE_SQUAD_STATUS).
export const INACTIVE_STATUSES = ["NFI", "PUP", "IR", "Retired", "Inactive"];

// Not "inactive" in the traditional sense — still gets its own tab and
// shows in "all", just excluded from the position-group depth chart tabs.
export const PRACTICE_SQUAD_STATUS = "PS";

export const VIEW_TABS = [
  "all",
  "offense",
  "defense",
  "special",
  "practice_squad",
  "inactive",
];
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

export function getSchoolById(schools, id) {
  if (!schools || id === null || id === undefined) return null;
  return schools.find((school) => school.id === id) || null;
}

// Strips a trailing numeric suffix used only to give structurally-identical
// depth chart slots unique keys (e.g. "DT1"/"DT2", "ILB1"/"ILB2") — the real
// depth chart doesn't differentiate them, so both rows should still just
// read "DT" / "ILB" on screen.
export function getPositionLabel(position) {
  if (!position) return "";
  return position.replace(/\d+$/, "");
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

// Groups players by depth_position for the depth chart, sorted by
// depth_order. Players with no depth_order set (nullable, e.g. someone not
// currently in the rotation) sort to the end of their position group rather
// than defaulting to a fake starter slot. Filters out INACTIVE_STATUSES
// itself (NFI/PUP/IR/Retired/Inactive) rather than trusting callers to
// pre-filter — a player can carry a stale depth_position from before they
// went on IR/were cut/etc, and that shouldn't put them back on the chart.
// Practice squad is excluded here too — they get their own flat roster tab
// instead of a ranked depth-chart slot (see PRACTICE_SQUAD_STATUS).
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
    if (INACTIVE_STATUSES.includes(player.status)) return;
    if (player.status === PRACTICE_SQUAD_STATUS) return;
    if (grouped[player.depthPosition]) {
      grouped[player.depthPosition].push(player);
    }
  });

  Object.keys(grouped).forEach((position) => {
    grouped[position].sort((a, b) => {
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

  if (activeTab === "inactive") {
    filtered = players.filter((player) =>
      INACTIVE_STATUSES.includes(player.status),
    );
  } else if (activeTab === "practice_squad") {
    filtered = players.filter(
      (player) => player.status === PRACTICE_SQUAD_STATUS,
    );
  } else if (activeTab === "all") {
    filtered = players.filter(
      (player) => !INACTIVE_STATUSES.includes(player.status),
    );
  } else {
    const positionsInTab = DEPTH_POSITIONS_ORDER[activeTab] || [];

    filtered = players.filter(
      (player) =>
        !INACTIVE_STATUSES.includes(player.status) &&
        player.status !== PRACTICE_SQUAD_STATUS &&
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
        comparison = getNumberValue(a.number) - getNumberValue(b.number);
      } else if (key === "name") {
        comparison = a.name.localeCompare(b.name);
      } else if (key === "position") {
        comparison = a.position.localeCompare(b.position);
      } else if (key === "age") {
        comparison = getAgeValue(a.age) - getAgeValue(b.age);
      } else if (key === "exp") {
        comparison = getExpValue(a.exp) - getExpValue(b.exp);
      } else if (key === "weight") {
        comparison = getWeightValue(a.weight) - getWeightValue(b.weight);
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
