import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchTransactions, fetchPlayers } from "@/api";
import fetchTransactionPlayers from "@/api/fetchTransactionPlayers";
import { mergeLocalData, isLocalId } from "@/admin/localStore";
import { pushCreate, pushDelete, pushUpdate } from "@/admin/xanoWrite";
import { formatDateShort } from "./adminFormat";
import EntityAdminTable from "./EntityAdminTable";
import styles from "./Admin.module.css";

const QUERY_KEY = ["transactions", null];
const JOINS_QUERY_KEY = ["transaction_players"];

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
    { value: "roundup", label: "Roundup" },
];

// Mirrors the category filter options in TransactionList.
const CATEGORY_OPTIONS = [
    { value: "addition", label: "Addition" },
    { value: "loss", label: "Loss" },
    { value: "trade", label: "Trade" },
    { value: "restructure", label: "Restructure" },
    { value: "roundup", label: "Roundup" },
];

// Player links live in the transaction_players join table, not on the
// transaction record itself, so they can't go through the normal local-first
// save/push flow (a join row referencing a not-yet-pushed local transaction
// id wouldn't mean anything in Xano). This writes straight to Xano the
// moment a checkbox changes, which is why it's called out as immediate.
function PlayerLinksField({ recordId, isNew, commitNew, players, joins, queryClient }) {
    const [filter, setFilter] = useState("");
    const [pendingIds, setPendingIds] = useState(() => new Set());
    const [creating, setCreating] = useState(false);

    if (isNew || isLocalId(recordId)) {
        const handleCreate = async () => {
            setCreating(true);
            try {
                await commitNew();
            } finally {
                setCreating(false);
            }
        };

        return (
            <div>
                <p className={styles.formHint}>
                    Player links point at a real Xano row, so this transaction needs
                    to exist there first — the rest of the form (title, analysis,
                    image, etc.) will save right along with it.
                </p>
                <button
                    type='button'
                    className={styles.addBtn}
                    onClick={handleCreate}
                    disabled={creating}
                >
                    {creating ? "Creating…" : "Create transaction now"}
                </button>
            </div>
        );
    }

    const linkedJoins = joins.filter((join) => join.transactions_id === recordId);
    const linkedPlayerIds = new Set(linkedJoins.map((join) => join.players_id));

    const filteredPlayers = filter
        ? players.filter((p) => p.name.toLowerCase().includes(filter.toLowerCase()))
        : players;

    const toggle = async (player) => {
        setPendingIds((prev) => new Set(prev).add(player.id));
        try {
            if (linkedPlayerIds.has(player.id)) {
                const join = linkedJoins.find((j) => j.players_id === player.id);
                await pushDelete("transaction_players", join.id);
            } else {
                await pushCreate("transaction_players", {
                    transactions_id: recordId,
                    players_id: player.id,
                });
            }
            queryClient.invalidateQueries({ queryKey: JOINS_QUERY_KEY });
        } catch (err) {
            window.alert(`Couldn't update player link: ${err.message}`);
        } finally {
            setPendingIds((prev) => {
                const next = new Set(prev);
                next.delete(player.id);
                return next;
            });
        }
    };

    return (
        <div>
            <input
                className={styles.formInput}
                type='text'
                placeholder='Filter players…'
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
            />
            <div className={styles.playerLinksList}>
                {filteredPlayers.map((player) => (
                    <label key={player.id} className={styles.playerLinksItem}>
                        <input
                            type='checkbox'
                            checked={linkedPlayerIds.has(player.id)}
                            disabled={pendingIds.has(player.id)}
                            onChange={() => toggle(player)}
                        />
                        <span>
                            {player.position ? `${player.position} ${player.name}` : player.name}
                        </span>
                    </label>
                ))}
            </div>
            <span className={styles.formHint}>
                Saves immediately — no push step for player links.
            </span>
        </div>
    );
}

// active is the deliberate publish/draft flag — it defaults to false in
// Xano, so a new transaction is a draft (invisible on the live site) until
// someone explicitly activates it here, like hitting publish on a post.
// Writes straight to Xano rather than going through local-first staging,
// same reasoning as the player links: the entire point is controlling real
// visibility precisely, so staging it locally would just be confusing.
function ActiveToggle({ record, queryClient }) {
    const [pending, setPending] = useState(false);

    if (isLocalId(record.id)) {
        return <span className={styles.formHint}>Push to Xano first</span>;
    }

    const toggle = async () => {
        setPending(true);
        try {
            await pushUpdate("transactions", record.id, { active: !record.active });
            await queryClient.invalidateQueries({ queryKey: QUERY_KEY });
        } catch (err) {
            window.alert(`Couldn't update publish status: ${err.message}`);
        } finally {
            setPending(false);
        }
    };

    return (
        <div className={styles.activeToggle}>
            <span
                className={`${styles.statusBadge} ${
                    record.active ? styles.statusBadgeActive : styles.statusBadgeDraft
                }`}
            >
                {record.active ? "Published" : "Draft"}
            </span>
            <button
                type='button'
                className={styles.activateBtn}
                onClick={toggle}
                disabled={pending}
            >
                {pending ? "…" : record.active ? "Deactivate" : "Activate"}
            </button>
        </div>
    );
}

export default function TransactionsAdmin() {
    const queryClient = useQueryClient();

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
        queryKey: JOINS_QUERY_KEY,
        queryFn: fetchTransactionPlayers,
    });
    const { data: rawPlayers } = useQuery({
        queryKey: ["players"],
        queryFn: fetchPlayers,
    });

    const players = useMemo(
        () =>
            [...mergeLocalData("players", rawPlayers ?? [])].sort((a, b) =>
                a.name.localeCompare(b.name),
            ),
        [rawPlayers],
    );

    const linkedPlayersByTransaction = useMemo(() => {
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
    }, [joins, players]);

    const fields = useMemo(
        () => [
            { name: "date", label: "Date", type: "date" },
            { name: "year", label: "Year", type: "number" },
            { name: "type", label: "Type", type: "select", options: TYPE_OPTIONS },
            { name: "category", label: "Category", type: "select", options: CATEGORY_OPTIONS },
            { name: "title", label: "Title", type: "text" },
            { name: "image_url", label: "Image", type: "image", wide: true },
            { name: "image_description", label: "Image Description", type: "text" },
            { name: "analysis", label: "Analysis", type: "textarea", rows: 8, wide: true },
            { name: "update", label: "Update", type: "textarea", rows: 6, wide: true },
            {
                name: "linked_players",
                label: "Players",
                type: "custom",
                wide: true,
                render: ({ recordId, isNew, commitNew }) => (
                    <PlayerLinksField
                        recordId={recordId}
                        isNew={isNew}
                        commitNew={commitNew}
                        players={players}
                        joins={joins ?? []}
                        queryClient={queryClient}
                    />
                ),
            },
        ],
        [players, joins, queryClient],
    );

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
            fields={fields}
            getRowLabel={(r) => r.title || `${r.type} — ${r.date}`}
            listColumns={[
                {
                    key: "status",
                    label: "Status",
                    align: "center",
                    render: (r) => <ActiveToggle record={r} queryClient={queryClient} />,
                },
                {
                    key: "date",
                    label: "Date",
                    align: "center",
                    render: (r) => formatDateShort(r.date),
                },
                { key: "year", label: "Year", align: "center" },
                { key: "type", label: "Type", align: "center" },
                { key: "category", label: "Category", align: "center" },
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
                        const linked = linkedPlayersByTransaction.get(r.id);
                        if (!linked || linked.length === 0) return "-";
                        return (
                            <>
                                {linked.map((p) => (
                                    <div key={p.id}>
                                        {p.position ? `${p.position} ${p.name}` : p.name}
                                    </div>
                                ))}
                            </>
                        );
                    },
                },
            ]}
        />
    );
}
