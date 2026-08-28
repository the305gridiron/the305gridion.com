import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { LayoutGrid, Table2 } from "lucide-react";
import { fetchPlayers } from "@/api";
import fetchSchools from "@/api/fetchSchools";
import { mergeLocalData } from "@/admin/localStore";
import { DEPTH_POSITIONS_ORDER } from "@/pages/Roster/rosterConfig";
import { formatDateShort } from "./adminFormat";
import EntityAdminTable from "./EntityAdminTable";
import DepthChartBoard from "./DepthChartBoard";
import styles from "./Admin.module.css";

// Same offense -> defense -> special ordering the live depth chart uses.
// Positions outside this list (or missing) sort to the end.
const DEPTH_POSITION_RANK = new Map(
    [
        ...DEPTH_POSITIONS_ORDER.offense,
        ...DEPTH_POSITIONS_ORDER.defense,
        ...DEPTH_POSITIONS_ORDER.special,
    ].map((position, index) => [position, index]),
);

function sortByDepth(players) {
    return [...players].sort((a, b) => {
        const rankA = DEPTH_POSITION_RANK.get(a.depth_position) ?? Infinity;
        const rankB = DEPTH_POSITION_RANK.get(b.depth_position) ?? Infinity;
        if (rankA !== rankB) return rankA - rankB;

        const orderA = a.depth_order ?? Infinity;
        const orderB = b.depth_order ?? Infinity;
        return orderA - orderB;
    });
}

const QUERY_KEY = ["players"];

const STATUS_OPTIONS = ["Active", "Inactive", "PS", "NFI", "PUP", "IR", "Retired"];

// Every raw `position` value seen across the live players table — this
// endpoint doesn't publish a formal enum, so this list is a survey of what's
// actually in use (including the alternate labels rosterConfig's
// normalizePositionKey knows how to fold together, e.g. OT/G/T/FB/DB).
const POSITION_OPTIONS = [
    "QB", "RB", "FB", "WR", "TE",
    "T", "OT", "G", "G/T", "C", "OL", "IOL",
    "DL", "NT", "EDGE", "EDGE/ILB",
    "OLB", "ILB", "LB",
    "CB", "DB", "S", "FS", "SS",
    "K", "P", "LS",
];

const DEPTH_POSITION_OPTIONS = [
    ...DEPTH_POSITIONS_ORDER.offense,
    ...DEPTH_POSITIONS_ORDER.defense,
    ...DEPTH_POSITIONS_ORDER.special,
];

function buildFields(schoolOptions) {
    return [
        { name: "status", label: "Status", type: "select", options: STATUS_OPTIONS },
        { name: "number", label: "Number", type: "number" },
        { name: "name", label: "Name", type: "text" },
        { name: "slug", label: "Slug", type: "text" },
        { name: "position", label: "Position", type: "select", options: POSITION_OPTIONS },
        { name: "height", label: "Height", type: "text" },
        { name: "weight", label: "Weight (lbs)", type: "text" },
        { name: "dob", label: "Date of Birth", type: "date" },
        { name: "draft_year", label: "Draft Year", type: "number" },
        {
            name: "depth_position",
            label: "Depth Position",
            type: "select",
            options: DEPTH_POSITION_OPTIONS,
        },
        { name: "depth_order", label: "Depth Order", type: "number" },
        {
            name: "school_id",
            label: "School",
            type: "select",
            valueType: "number",
            options: schoolOptions,
        },
        { name: "image", label: "Image", type: "image", wide: true },
    ];
}

export default function PlayersAdmin() {
    const [view, setView] = useState("table");
    // Bumped after a depth-chart drag-drop writes directly to localStorage,
    // so the merged player list below (and the Table view once you switch
    // back to it) picks up the change immediately.
    const [localVersion, setLocalVersion] = useState(0);

    // Reuses the "players" query cache (shared with usePlayersQuery) but
    // skips its local-data `select` — this component needs the raw Xano
    // list so it can merge/re-merge with the latest localStorage state
    // itself on every edit.
    const { data, isLoading, isError } = useQuery({
        queryKey: QUERY_KEY,
        queryFn: fetchPlayers,
    });

    const { data: rawSchools } = useQuery({
        queryKey: ["schools"],
        queryFn: fetchSchools,
    });

    // Includes schools created/edited in the Schools tab but not yet pushed
    // to Xano, so a brand-new school is selectable here right away.
    const schoolOptions = useMemo(() => {
        const schools = mergeLocalData("schools", rawSchools ?? []);
        return [...schools]
            .sort((a, b) => a.full_name.localeCompare(b.full_name))
            .map((school) => ({ value: school.id, label: school.full_name }));
    }, [rawSchools]);

    const fields = useMemo(() => buildFields(schoolOptions), [schoolOptions]);

    // Depth chart drag-and-drop writes straight to localStorage (via
    // saveRecord, same as everything else), bypassing EntityAdminTable
    // entirely — this is the merged view it needs to read from.
    const activePlayers = useMemo(
        () =>
            mergeLocalData("players", data ?? []).filter(
                (p) => p.status !== "Inactive",
            ),
        // eslint-disable-next-line react-hooks/exhaustive-deps -- localVersion is the recompute trigger, not a real dependency
        [data, localVersion],
    );

    if (isLoading) return <p className={styles.stateMessage}>Loading players…</p>;
    if (isError) {
        return (
            <p className={styles.stateMessage}>
                Couldn't reach the players API — local edits will still work
                once it loads.
            </p>
        );
    }

    return (
        <>
            <div className={styles.viewToggle}>
                <button
                    className={`${styles.viewToggleBtn} ${view === "table" ? styles.viewToggleBtnActive : ""}`}
                    onClick={() => setView("table")}
                >
                    <Table2 size={14} /> Table
                </button>
                <button
                    className={`${styles.viewToggleBtn} ${view === "depth_chart" ? styles.viewToggleBtnActive : ""}`}
                    onClick={() => setView("depth_chart")}
                >
                    <LayoutGrid size={14} /> Depth Chart
                </button>
            </div>

            {view === "table" ? (
                <EntityAdminTable
                    entity='players'
                    label='Players'
                    sourceRecords={sortByDepth(data ?? [])}
                    queryKey={QUERY_KEY}
                    fields={fields}
                    filterRecord={(player) => player.status !== "Inactive"}
                    getRowLabel={(r) => r.name || `Player #${r.id}`}
                    listColumns={[
                        { key: "number", label: "#", align: "center" },
                        { key: "name", label: "Name" },
                        { key: "status", label: "Status", align: "center" },
                        { key: "position", label: "Pos", align: "center" },
                        { key: "depth_position", label: "Depth Pos", align: "center" },
                        { key: "depth_order", label: "Depth Order", align: "center" },
                        {
                            key: "dob",
                            label: "DOB",
                            align: "center",
                            render: (r) => formatDateShort(r.dob),
                        },
                        { key: "draft_year", label: "Draft Yr", align: "center" },
                    ]}
                />
            ) : (
                <DepthChartBoard
                    players={activePlayers}
                    onSaved={() => setLocalVersion((v) => v + 1)}
                />
            )}
        </>
    );
}
