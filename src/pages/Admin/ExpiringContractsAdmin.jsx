import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchExpiringContracts, fetchPlayers, fetchTeams, fetchTransactions } from "@/api";
import { mergeLocalData } from "@/admin/localStore";
import { TEAM_COLORS } from "./nflTeamColors";
import EntityAdminTable from "./EntityAdminTable";
import styles from "./Admin.module.css";

const QUERY_KEY = ["expiring_contracts"];

// Miami's own id in the teams table — the one team_id value on this table
// that means "re-signed with us" rather than "signed elsewhere."
const MIAMI_TEAM_ID = 2;

const STATUS_OPTIONS = ["unsigned", "signed"];

function buildFields(playerOptions, teamOptions, transactionOptions) {
    return [
        { name: "player_id", label: "Player", type: "select", valueType: "number", options: playerOptions },
        { name: "year", label: "Year", type: "number" },
        { name: "status", label: "Status", type: "select", options: STATUS_OPTIONS },
        {
            name: "team_id",
            label: "Team",
            type: "select",
            valueType: "number",
            options: teamOptions,
            hint: "Leave blank while unsigned. Pick Miami if they re-signed with the Dolphins — anything else means they signed elsewhere.",
        },
        {
            name: "transaction_id",
            label: "Linked Transaction",
            type: "select",
            valueType: "number",
            options: transactionOptions,
            hint: "Only needed when Team is Miami — link the re_sign transaction for this player (create it in the Transactions tab first if it doesn't exist yet).",
        },
    ];
}

export default function ExpiringContractsAdmin() {
    const { data, isLoading, isError } = useQuery({
        queryKey: QUERY_KEY,
        queryFn: fetchExpiringContracts,
    });

    const { data: rawPlayers } = useQuery({ queryKey: ["players"], queryFn: fetchPlayers });
    const { data: rawTeams } = useQuery({ queryKey: ["teams"], queryFn: fetchTeams });
    const { data: rawTransactions } = useQuery({
        queryKey: ["transactions", null],
        queryFn: () => fetchTransactions(),
    });

    const players = useMemo(
        () => mergeLocalData("players", rawPlayers ?? []),
        [rawPlayers],
    );
    const teams = useMemo(() => mergeLocalData("teams", rawTeams ?? []), [rawTeams]);
    const transactions = useMemo(
        () => mergeLocalData("transactions", rawTransactions ?? []),
        [rawTransactions],
    );

    const playersById = useMemo(() => new Map(players.map((p) => [p.id, p])), [players]);
    const teamsById = useMemo(() => new Map(teams.map((t) => [t.id, t])), [teams]);
    const transactionsById = useMemo(
        () => new Map(transactions.map((t) => [t.id, t])),
        [transactions],
    );

    const playerOptions = useMemo(
        () =>
            [...players]
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((p) => ({ value: p.id, label: p.name })),
        [players],
    );

    const teamOptions = useMemo(
        () =>
            [...teams]
                .sort((a, b) => a.full_name.localeCompare(b.full_name))
                .map((t) => ({
                    value: t.id,
                    label: t.id === MIAMI_TEAM_ID ? `${t.full_name} (re-signed)` : t.full_name,
                })),
        [teams],
    );

    const transactionOptions = useMemo(
        () =>
            [...transactions]
                .sort((a, b) => (b.date || "").localeCompare(a.date || ""))
                .map((t) => ({
                    value: t.id,
                    label: t.title
                        ? t.title.length > 50
                            ? `${t.title.slice(0, 50)}…`
                            : t.title
                        : `${t.type} — ${t.date}`,
                })),
        [transactions],
    );

    const fields = useMemo(
        () => buildFields(playerOptions, teamOptions, transactionOptions),
        [playerOptions, teamOptions, transactionOptions],
    );

    // Historical rows use 0 for "no team" instead of null, which isn't a
    // valid <select> option — fold it to null on the way in. Any row that
    // gets edited and pushed writes the corrected null back to Xano; rows
    // nobody touches just keep reading correctly here in the meantime.
    const records = useMemo(
        () => (data ?? []).map((r) => ({ ...r, team_id: r.team_id || null })),
        [data],
    );

    if (isLoading) {
        return <p className={styles.stateMessage}>Loading expiring contracts…</p>;
    }
    if (isError) {
        return (
            <p className={styles.stateMessage}>
                Couldn't reach the expiring contracts API — local edits will
                still work once it loads.
            </p>
        );
    }

    const listColumns = [
        {
            key: "player",
            label: "Player",
            render: (r) => playersById.get(r.player_id)?.name || `#${r.player_id}`,
        },
        { key: "year", label: "Year", align: "center" },
        { key: "status", label: "Status", align: "center" },
        {
            key: "team",
            label: "Team",
            align: "center",
            render: (r) => {
                if (!r.team_id) return "-";
                const team = teamsById.get(r.team_id);
                if (!team) return r.team_id;
                return (
                    <span className={styles.teamCell}>
                        {team.logo && (
                            <img src={team.logo} alt='' className={styles.listThumb} />
                        )}
                        {team.abbr}
                    </span>
                );
            },
        },
        {
            key: "transaction",
            label: "Linked Txn",
            align: "center",
            render: (r) =>
                r.transaction_id
                    ? transactionsById.get(r.transaction_id)?.title || `#${r.transaction_id}`
                    : "-",
        },
    ];

    const getRowLabel = (r) => playersById.get(r.player_id)?.name || `Contract #${r.id}`;

    // Subtle left-edge accent in the signed team's color — Xano has no
    // color field on teams, so this leans on the same public brand-color
    // map used nowhere else, just for this one fun touch.
    const getSignedRowStyle = (r) => {
        const abbr = teamsById.get(r.team_id)?.abbr;
        const color = abbr && TEAM_COLORS[abbr];
        return color ? { boxShadow: `inset 4px 0 0 ${color}` } : undefined;
    };

    return (
        <>
            <h3 className={styles.adminSubheading}>Unsigned</h3>
            <EntityAdminTable
                entity='expiring_contracts'
                label='Expiring Contracts'
                sourceRecords={records}
                queryKey={QUERY_KEY}
                fields={fields}
                filterRecord={(r) => r.status === "unsigned"}
                getRowLabel={getRowLabel}
                listColumns={listColumns}
            />

            <h3 className={styles.adminSubheading}>Signed</h3>
            <EntityAdminTable
                entity='expiring_contracts'
                label='Expiring Contracts'
                sourceRecords={records}
                queryKey={QUERY_KEY}
                fields={fields}
                filterRecord={(r) => r.status === "signed"}
                getRowLabel={getRowLabel}
                listColumns={listColumns}
                getRowStyle={getSignedRowStyle}
            />
        </>
    );
}
