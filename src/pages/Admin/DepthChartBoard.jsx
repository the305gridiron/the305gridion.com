import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
    DndContext,
    DragOverlay,
    PointerSensor,
    closestCorners,
    useDroppable,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { EyeOff, UploadCloud } from "lucide-react";
import { saveRecord, getLocalStatus } from "@/admin/localStore";
import { pushAllRecords, estimatePushDurationSeconds } from "@/admin/pushPending";
import { RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS } from "@/admin/xanoWrite";
import { DEPTH_POSITIONS_ORDER } from "@/pages/Roster/rosterConfig";
import adminStyles from "./Admin.module.css";
import styles from "./DepthChartBoard.module.css";

const UNASSIGNED = "__unassigned__";

// Purely a view preference for this admin tool, not roster data — never
// touches Xano, so it doesn't go through localStore.js's push/pull pattern.
const HIDDEN_KEY = "admin:depth_chart:hidden_players";

function getHiddenIds() {
    try {
        const raw = localStorage.getItem(HIDDEN_KEY);
        return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch {
        return new Set();
    }
}

function persistHiddenIds(ids) {
    localStorage.setItem(HIDDEN_KEY, JSON.stringify([...ids]));
}

const POSITION_CARDS = [
    ...DEPTH_POSITIONS_ORDER.offense.map((position) => ({ position, group: "Offense" })),
    ...DEPTH_POSITIONS_ORDER.defense.map((position) => ({ position, group: "Defense" })),
    ...DEPTH_POSITIONS_ORDER.special.map((position) => ({ position, group: "Special Teams" })),
];
const KNOWN_POSITIONS = new Set(POSITION_CARDS.map((c) => c.position));

function groupPlayers(players) {
    const grouped = {};
    POSITION_CARDS.forEach(({ position }) => {
        grouped[position] = [];
    });
    grouped[UNASSIGNED] = [];

    players.forEach((player) => {
        const key = KNOWN_POSITIONS.has(player.depth_position) ? player.depth_position : UNASSIGNED;
        grouped[key].push(player);
    });

    Object.values(grouped).forEach((list) =>
        list.sort((a, b) => (a.depth_order ?? Infinity) - (b.depth_order ?? Infinity)),
    );

    return grouped;
}

function findContainerOf(playerId, grouped) {
    return Object.keys(grouped).find((key) => grouped[key].some((p) => p.id === playerId));
}

function PlayerChipContent({ player }) {
    return (
        <>
            {player.number != null && player.number !== "" && (
                <span className={styles.chipNumber}>#{player.number}</span>
            )}
            <span className={styles.chipName}>{player.name}</span>
        </>
    );
}

function PlayerChip({ player, onHide }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: player.id,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} className={styles.chip}>
            <span className={styles.chipDragArea} {...attributes} {...listeners}>
                <PlayerChipContent player={player} />
            </span>
            <button
                type='button'
                className={styles.chipHideBtn}
                onClick={() => onHide(player.id)}
                aria-label={`Hide ${player.name} from depth chart`}
                title='Hide from depth chart'
            >
                <EyeOff size={12} />
            </button>
        </div>
    );
}

function PositionCard({ position, group, players, onHide }) {
    const { setNodeRef } = useDroppable({ id: position });

    return (
        <div ref={setNodeRef} className={styles.card}>
            <div className={styles.cardHeader}>
                <span className={styles.cardPosition}>
                    {position === UNASSIGNED ? "Unassigned" : position}
                </span>
                <span className={styles.cardGroup}>{group}</span>
            </div>
            <SortableContext
                id={position}
                items={players.map((p) => p.id)}
                strategy={verticalListSortingStrategy}
            >
                <div className={styles.cardBody}>
                    {players.length === 0 && <p className={styles.cardEmpty}>No players</p>}
                    {players.map((player) => (
                        <PlayerChip key={player.id} player={player} onHide={onHide} />
                    ))}
                </div>
            </SortableContext>
        </div>
    );
}

// Drag players between position cards to change depth_position, or reorder
// within a card to change depth_order — saves the same way every other edit
// in this admin does: to localStorage first, pushed to Xano explicitly.
export default function DepthChartBoard({ players, onSaved }) {
    const queryClient = useQueryClient();
    const [hiddenIds, setHiddenIds] = useState(() => getHiddenIds());
    const [activePlayer, setActivePlayer] = useState(null);
    const [isPushing, setIsPushing] = useState(false);
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    );

    const visiblePlayers = useMemo(
        () => players.filter((p) => !hiddenIds.has(p.id)),
        [players, hiddenIds],
    );
    const [grouped, setGrouped] = useState(() => groupPlayers(visiblePlayers));

    useEffect(() => {
        setGrouped(groupPlayers(visiblePlayers));
    }, [visiblePlayers]);

    const hidePlayer = (id) => {
        setHiddenIds((prev) => {
            const next = new Set(prev).add(id);
            persistHiddenIds(next);
            return next;
        });
    };

    const unhideAll = () => {
        setHiddenIds(new Set());
        persistHiddenIds(new Set());
    };

    const pendingPlayers = useMemo(
        () => players.filter((p) => getLocalStatus("players", p.id)),
        [players],
    );

    const handlePushAll = async () => {
        if (pendingPlayers.length === 0) return;
        const estimateSeconds = estimatePushDurationSeconds(pendingPlayers.length);
        const estimateNote =
            estimateSeconds > 0
                ? ` Xano allows ${RATE_LIMIT_MAX} requests per ${RATE_LIMIT_WINDOW_MS / 1000}s on this plan, so this will take at least ~${estimateSeconds}s.`
                : "";
        if (
            !window.confirm(
                `Push ${pendingPlayers.length} local change${pendingPlayers.length === 1 ? "" : "s"} to Xano now?${estimateNote}`,
            )
        ) {
            return;
        }

        setIsPushing(true);
        try {
            const { pushedCount, failures, stoppedForRateLimit } = await pushAllRecords(
                "players",
                pendingPlayers,
            );
            // Wait for the refetch to land before re-rendering — otherwise
            // the merge below runs against the pre-push cached data with
            // the (now-cleared) local overrides gone, which looks exactly
            // like the change reverting even though Xano has it fine.
            await queryClient.invalidateQueries({ queryKey: ["players"] });
            onSaved?.();

            if (stoppedForRateLimit) {
                const remaining = pendingPlayers.length - pushedCount - failures.length;
                window.alert(
                    `Stopped after Xano started rate-limiting requests. Pushed ${pushedCount}/${pendingPlayers.length} — ${remaining} left to try. Wait a minute or two, then push again.`,
                );
            } else if (failures.length > 0) {
                window.alert(
                    `Pushed ${pushedCount}/${pendingPlayers.length}. Failed:\n${failures
                        .map((f) => `${f.record.name}: ${f.message}`)
                        .join("\n")}`,
                );
            }
        } finally {
            setIsPushing(false);
        }
    };

    const handleDragStart = (event) => {
        const player = Object.values(grouped)
            .flat()
            .find((p) => p.id === event.active.id);
        setActivePlayer(player ?? null);
    };

    const handleDragOver = (event) => {
        const { active, over } = event;
        if (!over) return;

        const activeContainer = findContainerOf(active.id, grouped);
        const overContainer = grouped[over.id] ? over.id : findContainerOf(over.id, grouped);

        if (!activeContainer || !overContainer || activeContainer === overContainer) return;

        setGrouped((prev) => {
            const activeItems = [...prev[activeContainer]];
            const overItems = [...prev[overContainer]];
            const activeIndex = activeItems.findIndex((p) => p.id === active.id);
            if (activeIndex === -1) return prev;

            const [moved] = activeItems.splice(activeIndex, 1);
            const overIndex = overItems.findIndex((p) => p.id === over.id);
            overItems.splice(overIndex >= 0 ? overIndex : overItems.length, 0, moved);

            return { ...prev, [activeContainer]: activeItems, [overContainer]: overItems };
        });
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        setActivePlayer(null);
        if (!over) return;

        const container = findContainerOf(active.id, grouped);
        if (!container) return;

        const items = [...grouped[container]];
        const activeIndex = items.findIndex((p) => p.id === active.id);
        const overIndex = grouped[over.id] ? items.length - 1 : items.findIndex((p) => p.id === over.id);

        const reordered =
            overIndex >= 0 && overIndex !== activeIndex
                ? arrayMove(items, activeIndex, overIndex)
                : items;

        setGrouped((prev) => ({ ...prev, [container]: reordered }));

        // Only the destination container needs its order rewritten — a
        // source container's remaining players keep whatever order values
        // they already had, which is still a valid (if non-contiguous) sort.
        const newDepthPosition = container === UNASSIGNED ? "" : container;
        reordered.forEach((player, index) => {
            const nextOrder = index + 1;
            if (player.depth_position !== newDepthPosition || player.depth_order !== nextOrder) {
                saveRecord("players", {
                    id: player.id,
                    depth_position: newDepthPosition,
                    depth_order: nextOrder,
                });
            }
        });

        onSaved?.();
    };

    return (
        <>
            <div className={styles.toolbar}>
                <span className={styles.toolbarLeft}>
                    {hiddenIds.size > 0 && (
                        <span className={styles.hiddenNote}>
                            {hiddenIds.size} hidden from this view —{" "}
                            <button type='button' className={styles.hiddenShowBtn} onClick={unhideAll}>
                                show all
                            </button>
                        </span>
                    )}
                </span>
                {pendingPlayers.length > 0 && (
                    <button
                        className={adminStyles.pushAllBtn}
                        onClick={handlePushAll}
                        disabled={isPushing}
                    >
                        <UploadCloud size={14} /> Push {pendingPlayers.length} to Xano
                    </button>
                )}
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                <div className={styles.board}>
                    {POSITION_CARDS.map(({ position, group }) => (
                        <PositionCard
                            key={position}
                            position={position}
                            group={group}
                            players={grouped[position] ?? []}
                            onHide={hidePlayer}
                        />
                    ))}
                    <PositionCard
                        position={UNASSIGNED}
                        group='Needs a depth position'
                        players={grouped[UNASSIGNED] ?? []}
                        onHide={hidePlayer}
                    />
                </div>
                <DragOverlay>
                    {activePlayer && (
                        <div className={styles.chip}>
                            <PlayerChipContent player={activePlayer} />
                        </div>
                    )}
                </DragOverlay>
            </DndContext>
        </>
    );
}
