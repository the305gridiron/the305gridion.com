import { useQuery } from "@tanstack/react-query";
import { fetchProspects } from "@/api";
import EntityAdminTable from "./EntityAdminTable";
import styles from "./Admin.module.css";

const QUERY_KEY = ["prospect"];

// Survey of what's actually in use across the live prospect table — not a
// formal Xano enum, same approach as PlayersAdmin's POSITION_OPTIONS.
const POSITION_OPTIONS = ["QB", "RB", "WR", "TE", "OT", "IOL", "EDGE", "DL", "LB", "CB", "S"];

const DRAFT_RANGE_OPTIONS = [
    "Top 5", "Top 10", "Top 15",
    "Round 1", "Late Round 1",
    "Round 2", "Late Round 2",
    "Round 3", "Late Round 3",
    "Round 4", "Round 5", "Round 6",
];

const FIT_TIER_OPTIONS = [
    "Tier 1 - Core Target",
    "Tier 2 - Strong Fit",
    "Tier 3 - Conditional",
    "Tier 4 - Avoid / Depth",
];

const FIT_GRADE_OPTIONS = [
    "A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "D-",
];

// class/designation are left as free text — the live data already has
// inconsistent formats (e.g. "RS Junior" vs "Junior (RS)" vs "Sophmore
// (RS)"), so a fixed select would either reject real values or force
// typos into permanence. Better to let it stay exactly what someone types.
const FIELDS = [
    { name: "name", label: "Name", type: "text" },
    { name: "position", label: "Position", type: "select", options: POSITION_OPTIONS },
    { name: "college", label: "College", type: "text" },
    { name: "class", label: "Class", type: "text" },
    { name: "draft_year", label: "Draft Year", type: "number" },
    { name: "draft_rank", label: "Draft Rank (overall)", type: "number" },
    { name: "position_rank", label: "Position Rank", type: "number" },
    { name: "draft_range", label: "Projected Draft Range", type: "select", options: DRAFT_RANGE_OPTIONS },
    { name: "height", label: "Height", type: "text" },
    { name: "weight", label: "Weight (lbs)", type: "number" },
    { name: "age", label: "Age", type: "number" },
    { name: "designation", label: "Designation", type: "text", hint: "e.g. CC, M, P — combine freely, e.g. \"M, P\"" },
    { name: "base_grade", label: "Base Grade", type: "text" },
    { name: "base_grade_description", label: "Base Grade Description", type: "text" },
    { name: "fit_tier", label: "Fit Tier", type: "select", options: FIT_TIER_OPTIONS },
    { name: "fit_grade", label: "Fit Grade", type: "select", options: FIT_GRADE_OPTIONS },
    { name: "fit_score", label: "Fit Score", type: "number" },
    { name: "nfl_comparison", label: "NFL Comparison", type: "text" },
    { name: "injury_status", label: "Injury / Character Notes", type: "textarea", rows: 4, wide: true },
    { name: "profile", label: "Profile", type: "textarea", rows: 8, wide: true },
];

export default function ProspectsAdmin() {
    const { data, isLoading, isError } = useQuery({
        queryKey: QUERY_KEY,
        queryFn: () => fetchProspects(),
    });

    if (isLoading) return <p className={styles.stateMessage}>Loading prospects…</p>;
    if (isError) {
        return (
            <p className={styles.stateMessage}>
                Couldn't reach the prospects API — local edits will still work
                once it loads.
            </p>
        );
    }

    return (
        <EntityAdminTable
            entity='prospect'
            label='Prospects'
            sourceRecords={data ?? []}
            queryKey={QUERY_KEY}
            fields={FIELDS}
            getRowLabel={(r) => r.name || `Prospect #${r.id}`}
            listColumns={[
                { key: "name", label: "Name" },
                { key: "position", label: "Pos" },
                { key: "college", label: "College" },
                { key: "draft_year", label: "Year" },
                { key: "draft_rank", label: "Rank" },
                { key: "draft_range", label: "Range" },
                { key: "fit_tier", label: "Fit Tier" },
                { key: "fit_grade", label: "Fit Grade" },
            ]}
        />
    );
}
