import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchSchedule, fetchTeams } from "@/api";
import { mergeLocalData } from "@/admin/localStore";
import { formatGameDateShort, formatGameTime } from "@/pages/Schedule/scheduleConfig";
import EntityAdminTable from "./EntityAdminTable";
import styles from "./Admin.module.css";

const QUERY_KEY = ["schedule"];

const SEASON_TYPE_OPTIONS = ["PRE", "REGULAR", "POST"];
const LOCATION_TYPE_OPTIONS = ["HOME", "AWAY", "NEUTRAL"];
const RESULT_OPTIONS = ["WIN", "LOSS", "TIE"];

function buildFields(teamOptions, locationOptions) {
    return [
        { name: "year", label: "Year", type: "number" },
        { name: "week", label: "Week", type: "number" },
        { name: "season_type", label: "Season Type", type: "select", options: SEASON_TYPE_OPTIONS },
        { name: "is_bye_week", label: "Bye Week", type: "checkbox" },
        { name: "game_date", label: "Kickoff", type: "datetime" },
        { name: "opponent_id", label: "Opponent", type: "select", valueType: "number", options: teamOptions },
        {
            name: "location_id",
            label: "Location",
            type: "select",
            valueType: "number",
            options: locationOptions,
        },
        { name: "location_type", label: "Home/Away", type: "select", options: LOCATION_TYPE_OPTIONS },
        { name: "result", label: "Result", type: "select", options: RESULT_OPTIONS },
        { name: "dolphins_score", label: "Dolphins Score", type: "number" },
        { name: "opponents_score", label: "Opponent Score", type: "number" },
        { name: "preview_video_url", label: "Preview Video URL", type: "text" },
        { name: "reaction_video_url", label: "Reaction Video URL", type: "text" },
    ];
}

export default function ScheduleAdmin() {
    const { data, isLoading, isError } = useQuery({
        queryKey: QUERY_KEY,
        queryFn: fetchSchedule,
    });

    const { data: rawTeams } = useQuery({ queryKey: ["teams"], queryFn: fetchTeams });

    const teams = useMemo(() => mergeLocalData("teams", rawTeams ?? []), [rawTeams]);
    const teamsById = useMemo(() => new Map(teams.map((t) => [t.id, t])), [teams]);

    const teamOptions = useMemo(
        () =>
            [...teams]
                .sort((a, b) => a.full_name.localeCompare(b.full_name))
                .map((t) => ({ value: t.id, label: t.full_name })),
        [teams],
    );

    // Xano only exposes locations embedded inside schedule reads (no
    // standalone endpoint yet), so the option list is whatever venues
    // already show up across the loaded games.
    const locationsById = useMemo(() => {
        const map = new Map();
        (data ?? []).forEach((r) => {
            if (r.location_details) map.set(r.location_details.id, r.location_details);
        });
        return map;
    }, [data]);

    const locationOptions = useMemo(
        () =>
            [...locationsById.values()]
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((loc) => ({
                    value: loc.id,
                    label: `${loc.name} (${loc.city}, ${loc.state})`,
                })),
        [locationsById],
    );

    const fields = useMemo(
        () => buildFields(teamOptions, locationOptions),
        [teamOptions, locationOptions],
    );

    if (isLoading) return <p className={styles.stateMessage}>Loading schedule…</p>;
    if (isError) {
        return (
            <p className={styles.stateMessage}>
                Couldn't reach the schedule API — local edits will still work
                once it loads.
            </p>
        );
    }

    return (
        <EntityAdminTable
            entity='schedule'
            label='Schedule'
            sourceRecords={data ?? []}
            queryKey={QUERY_KEY}
            fields={fields}
            getRowLabel={(r) =>
                `Week ${r.week} vs ${teamsById.get(r.opponent_id)?.abbr || r.opponent_id} (${r.year})`
            }
            listColumns={[
                { key: "year", label: "Year" },
                { key: "week", label: "Week" },
                { key: "season_type", label: "Season" },
                { key: "date", label: "Date", render: (r) => formatGameDateShort(r.game_date) },
                { key: "time", label: "Kickoff", render: (r) => formatGameTime(r.game_date) || "-" },
                {
                    key: "opponent",
                    label: "Opponent",
                    render: (r) => teamsById.get(r.opponent_id)?.abbr || (r.opponent_id ?? "-"),
                },
                { key: "location_type", label: "H/A" },
                { key: "result", label: "Result" },
            ]}
        />
    );
}
