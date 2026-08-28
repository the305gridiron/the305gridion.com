import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchTransactions, fetchPlayers } from "@/api";
import fetchTransactionPlayers from "@/api/fetchTransactionPlayers";
import { mergeLocalData } from "@/admin/localStore";
import EntityAdminTable from "./EntityAdminTable";
import styles from "./Admin.module.css";

const QUERY_KEY = ["transactions", null];

// Mirrors TransactionCard's transactionTypeMap — those keys are what
// actually drive the icon/label shown on the live transaction cards, so
// picking anything outside this list means it renders with no icon.
const TYPE_OPTIONS = [
    { value: "release", label: "Released" },
    { value: "sign", label: "Signed" },
    { value: "trade_away", label: "Traded Away" },
    { value: "trade_for", label: "Acquired (Trade)" },
    { value: "tender", label: "Tendered" },
    { value: "restructure", label: "Restructured Contract" },
    { value: "re_sign", label: "Re-Signed" },
    { value: "udfa", label: "UDFA" },
    { value: "extension", label: "Signed Extension" },
];

// Mirrors the category filter options in TransactionList.
const CATEGORY_OPTIONS = [
    { value: "addition", label: "Addition" },
    { value: "loss", label: "Loss" },
    { value: "trade", label: "Trade" },
    { value: "restructure", label: "Restructure" },
];

const FIELDS = [
    { name: "date", label: "Date", type: "date" },
    { name: "year", label: "Year", type: "number" },
    { name: "type", label: "Type", type: "select", options: TYPE_OPTIONS },
    { name: "category", label: "Category", type: "select", options: CATEGORY_OPTIONS },
    { name: "title", label: "Title", type: "text" },
    { name: "image_url", label: "Image URL", type: "text" },
    { name: "image_description", label: "Image Description", type: "text" },
    { name: "analysis", label: "Analysis", type: "textarea", rows: 8, wide: true },
    { name: "update", label: "Update", type: "textarea", rows: 6, wide: true },
];

export default function TransactionsAdmin() {
    // See PlayersAdmin for why this bypasses useTransactionQuery's `select`
    // and reads the raw cached list directly.
    const { data, isLoading, isError } = useQuery({
        queryKey: QUERY_KEY,
        queryFn: () => fetchTransactions(),
    });

    // The players actually involved in a transaction don't live on the
    // transaction record itself (that `players` field is always empty) —
    // they're rows in the transaction_players join table, keyed by
    // transactions_id/players_id.
    const { data: joins } = useQuery({
        queryKey: ["transaction_players"],
        queryFn: fetchTransactionPlayers,
    });
    const { data: rawPlayers } = useQuery({
        queryKey: ["players"],
        queryFn: fetchPlayers,
    });

    const linkedPlayersByTransaction = useMemo(() => {
        const players = mergeLocalData("players", rawPlayers ?? []);
        const playersById = new Map(players.map((p) => [p.id, p]));
        const map = new Map();

        (joins ?? []).forEach((join) => {
            const player = playersById.get(join.players_id);
            if (!player) return;
            const list = map.get(join.transactions_id) ?? [];
            list.push(player);
            map.set(join.transactions_id, list);
        });

        return map;
    }, [joins, rawPlayers]);

    if (isLoading) {
        return <p className={styles.stateMessage}>Loading transactions…</p>;
    }
    if (isError) {
        return (
            <p className={styles.stateMessage}>
                Couldn't reach the transactions API — local edits will still
                work once it loads.
            </p>
        );
    }

    return (
        <EntityAdminTable
            entity='transactions'
            label='Transactions'
            sourceRecords={data ?? []}
            queryKey={QUERY_KEY}
            fields={FIELDS}
            getRowLabel={(r) => r.title || `${r.type} — ${r.date}`}
            listColumns={[
                { key: "date", label: "Date" },
                { key: "year", label: "Year" },
                { key: "type", label: "Type" },
                { key: "category", label: "Category" },
                {
                    key: "title",
                    label: "Title",
                    render: (r) =>
                        r.title
                            ? r.title.length > 60
                                ? `${r.title.slice(0, 60)}…`
                                : r.title
                            : "-",
                },
                {
                    key: "players",
                    label: "Players",
                    render: (r) => {
                        const players = linkedPlayersByTransaction.get(r.id);
                        if (!players || players.length === 0) return "-";
                        return players
                            .map((p) =>
                                p.position ? `${p.position} ${p.name}` : p.name,
                            )
                            .join(", ");
                    },
                },
            ]}
        />
    );
}

// Note: linked players come from the transaction_players join table (read
// via fetchTransactionPlayers) and are shown for reference, but editing
// those links isn't wired up here yet — that's still a Xano-side edit.
