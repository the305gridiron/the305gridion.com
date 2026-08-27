import React from "react";
import { GraduationCap, Stethoscope } from "lucide-react";
import {
    DEPTH_COLUMNS,
    DEPTH_POSITIONS_ORDER,
    matchesSearchQuery,
} from "./rosterConfig";
import styles from "./Roster.module.css";

const STRING_LABELS = ["1ST", "2ND", "3RD", "4TH", "5TH", "6TH"];

// Small inline flags next to a player's name: a medical icon for anyone
// not fully active (IR/PUP/NFI/Retired/PS still slotted in a depth
// position) and a grad-cap for rookies (0 years of experience).
function PlayerStatusIcons({ player }) {
    const isRookie = player.exp === "R";
    const isSidelined = Boolean(player.status) && player.status !== "Active";

    if (!isRookie && !isSidelined) return null;

    return (
        <span className={styles.playerStatusIcons}>
            {isSidelined && (
                <Stethoscope
                    size={12}
                    className={styles.sidelinedIcon}
                    title={player.status}
                />
            )}
            {isRookie && (
                <GraduationCap
                    size={12}
                    className={styles.rookieIcon}
                    title='Rookie'
                />
            )}
        </span>
    );
}

export default function DepthChartTable({ roster, activeTab, searchQuery }) {
    const activeCategories =
        activeTab === "all" ? ["offense", "defense", "special"] : [activeTab];

    return (
        <div className={styles.tableCard}>
            {/* Desktop / tablet table view */}
            <div
                className={`${styles.tableResponsive} ${styles.desktopTableWrap}`}
            >
                <table className={styles.depthTable}>
                    <thead>
                        <tr>
                            <th className={styles.posColHeader}>POS</th>
                            <th>1ST STRING (STARTER)</th>
                            <th>2ND STRING</th>
                            <th>3RD STRING</th>
                            <th>4TH STRING</th>
                            <th>5TH STRING</th>
                            <th>6TH STRING</th>
                        </tr>
                    </thead>

                    <tbody>
                        {activeCategories.map((category) => {
                            const positions =
                                DEPTH_POSITIONS_ORDER[category] || [];

                            return (
                                <React.Fragment key={category}>
                                    <tr className={styles.categoryDividerRow}>
                                        <td
                                            colSpan={7}
                                            className={
                                                styles.categoryDividerName
                                            }
                                        >
                                            {category === "special"
                                                ? "SPECIAL TEAMS"
                                                : category.toUpperCase()}
                                        </td>
                                    </tr>

                                    {positions.map((position) => {
                                        const players = roster[position] || [];

                                        const matchesSearch = players.some(
                                            (player) =>
                                                matchesSearchQuery(
                                                    player,
                                                    searchQuery,
                                                ),
                                        );

                                        if (
                                            searchQuery &&
                                            !matchesSearch
                                        ) {
                                            return null;
                                        }

                                        return (
                                            <tr
                                                key={position}
                                                className={styles.depthRow}
                                            >
                                                <td
                                                    className={
                                                        styles.posLabelCell
                                                    }
                                                >
                                                    <div
                                                        className={
                                                            styles.posLabelBadge
                                                        }
                                                    >
                                                        {position}
                                                    </div>
                                                </td>

                                                {DEPTH_COLUMNS.map(
                                                    (depthIndex) => {
                                                        const player =
                                                            players[
                                                                depthIndex
                                                            ];

                                                        if (!player) {
                                                            return (
                                                                <td
                                                                    key={
                                                                        depthIndex
                                                                    }
                                                                    className={
                                                                        styles.emptyDepthCell
                                                                    }
                                                                >
                                                                    <span
                                                                        className={
                                                                            styles.emptyDash
                                                                        }
                                                                    >
                                                                        -
                                                                    </span>
                                                                </td>
                                                            );
                                                        }

                                                        const isHighlighted =
                                                            matchesSearchQuery(
                                                                player,
                                                                searchQuery,
                                                            );

                                                        return (
                                                            <td
                                                                key={
                                                                    depthIndex
                                                                }
                                                                className={`${styles.playerCell} ${
                                                                    depthIndex ===
                                                                    0
                                                                        ? styles.starterCell
                                                                        : ""
                                                                } ${
                                                                    !isHighlighted
                                                                        ? styles.dimmedCell
                                                                        : ""
                                                                }`}
                                                            >
                                                                <div
                                                                    className={
                                                                        styles.cellContent
                                                                    }
                                                                >
                                                                    <div
                                                                        className={
                                                                            styles.playerNumName
                                                                        }
                                                                    >
                                                                        <span
                                                                            className={
                                                                                styles.cellNumber
                                                                            }
                                                                        >
                                                                            #
                                                                            {
                                                                                player.number
                                                                            }
                                                                        </span>

                                                                        <span
                                                                            className={
                                                                                styles.cellName
                                                                            }
                                                                        >
                                                                            {
                                                                                player.name
                                                                            }
                                                                        </span>

                                                                        <PlayerStatusIcons
                                                                            player={
                                                                                player
                                                                            }
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        );
                                                    },
                                                )}
                                            </tr>
                                        );
                                    })}
                                </React.Fragment>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Mobile card view */}
            <div className={styles.mobileCardList}>
                {activeCategories.map((category) => {
                    const positions =
                        DEPTH_POSITIONS_ORDER[category] || [];

                    return (
                        <div
                            key={category}
                            className={styles.mobileCategoryGroup}
                        >
                            <div className={styles.mobileCategoryTitle}>
                                {category === "special"
                                    ? "SPECIAL TEAMS"
                                    : category.toUpperCase()}
                            </div>

                            {positions.map((position) => {
                                const players = roster[position] || [];

                                const matchesSearch = players.some(
                                    (player) =>
                                        matchesSearchQuery(
                                            player,
                                            searchQuery,
                                        ),
                                );

                                if (
                                    searchQuery &&
                                    !matchesSearch
                                ) {
                                    return null;
                                }

                                return (
                                    <div
                                        key={position}
                                        className={styles.mobilePosCard}
                                    >
                                        <div
                                            className={
                                                styles.mobilePosCardHeader
                                            }
                                        >
                                            {position}
                                        </div>

                                        <div
                                            className={
                                                styles.mobilePosCardBody
                                            }
                                        >
                                            {DEPTH_COLUMNS.map(
                                                (depthIndex) => {
                                                    const player =
                                                        players[depthIndex];

                                                    const isHighlighted =
                                                        player
                                                            ? matchesSearchQuery(
                                                                  player,
                                                                  searchQuery,
                                                              )
                                                            : true;

                                                    return (
                                                        <div
                                                            key={depthIndex}
                                                            className={`${styles.mobileStringRow} ${
                                                                depthIndex ===
                                                                0
                                                                    ? styles.mobileStarterRow
                                                                    : ""
                                                            } ${
                                                                !isHighlighted
                                                                    ? styles.dimmedCell
                                                                    : ""
                                                            }`}
                                                        >
                                                            <span
                                                                className={
                                                                    styles.mobileStringLabel
                                                                }
                                                            >
                                                                {
                                                                    STRING_LABELS[
                                                                        depthIndex
                                                                    ]
                                                                }
                                                            </span>

                                                            {player ? (
                                                                <span
                                                                    className={
                                                                        styles.mobileStringPlayer
                                                                    }
                                                                >
                                                                    <span
                                                                        className={
                                                                            styles.cellNumber
                                                                        }
                                                                    >
                                                                        #
                                                                        {
                                                                            player.number
                                                                        }
                                                                    </span>{" "}
                                                                    {
                                                                        player.name
                                                                    }
                                                                    <PlayerStatusIcons
                                                                        player={
                                                                            player
                                                                        }
                                                                    />
                                                                </span>
                                                            ) : (
                                                                <span
                                                                    className={
                                                                        styles.emptyDash
                                                                    }
                                                                >
                                                                    -
                                                                </span>
                                                            )}
                                                        </div>
                                                    );
                                                },
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
