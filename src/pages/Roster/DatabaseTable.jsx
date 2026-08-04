import { Fragment } from "react";
import { User } from "lucide-react";
import { SORTABLE_COLUMNS } from "./rosterConfig";
import styles from "./Roster.module.css";

const POSITION_ORDER = [
    "QB",
    "RB",
    "WR",
    "TE",
    "T",
    "G",
    "C",
    "DL",
    "EDGE",
    "OLB",
    "ILB",
    "LB",
    "CB",
    "FS",
    "SS",
    "S",
    "K",
    "P",
    "LS",
];

const POSITION_LABELS = {
    QB: "Quarterback",
    RB: "Running Back",
    WR: "Wide Receiver",
    TE: "Tight End",
    T: "Tackle",
    G: "Guard",
    C: "Center",
    DL: "Defensive Line",
    EDGE: "Edge",
    OLB: "Outside Linebacker",
    ILB: "Inside Linebacker",
    LB: "Linebacker",
    CB: "Cornerback",
    FS: "Free Safety",
    SS: "Strong Safety",
    S: "Safety",
    K: "Kicker",
    P: "Punter",
    LS: "Long Snapper",
};

function normalizePositionKey(position = "") {
    const normalized = position.trim().toUpperCase();

    if (normalized === "G/T" || normalized === "T/G") {
        return "G";
    }

    if (normalized === "FB") {
        return "RB";
    }

    if (normalized === "DB") {
        return "CB";
    }

    if (normalized === "EDGE/ILB") {
        return "EDGE";
    }

    if (normalized === "DL") {
        return "DL";
    }

    return normalized || "QB";
}

function getPositionHeader(position) {
    return POSITION_LABELS[normalizePositionKey(position)] || position;
}

function groupPlayersByPosition(players) {
    return players.reduce((groups, player) => {
        const key = normalizePositionKey(player.position);
        if (!groups[key]) {
            groups[key] = [];
        }
        groups[key].push(player);
        return groups;
    }, {});
}

export default function DatabaseTable({ players, sortConfig, onSort }) {
    const groupedPlayers = groupPlayersByPosition(players);
    const groupedPositions = Object.keys(groupedPlayers).sort((a, b) => {
        const aIndex = POSITION_ORDER.indexOf(a);
        const bIndex = POSITION_ORDER.indexOf(b);

        if (aIndex === -1 && bIndex === -1) {
            return a.localeCompare(b);
        }

        if (aIndex === -1) {
            return 1;
        }

        if (bIndex === -1) {
            return -1;
        }

        return aIndex - bIndex;
    });

    return (
        <div className={styles.tableCard}>
            {/* Desktop / tablet table view */}
            <div className={`${styles.tableResponsive} ${styles.desktopTableWrap}`}>
                <table className={styles.databaseTable}>
                    <thead>
                        <tr>
                            {SORTABLE_COLUMNS.map(({ key, label }) => (
                                <th
                                    key={key}
                                    className={styles.clickableHeader}
                                    onClick={() => onSort(key)}
                                >
                                    {label}{" "}
                                    {sortConfig.key === key &&
                                        (sortConfig.direction === "asc"
                                            ? "▲"
                                            : "▼")}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {players.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={8}
                                    className={styles.noResultsCell}
                                >
                                    <User
                                        size={32}
                                        className={styles.noResultsIcon}
                                    />
                                    <div>
                                        No Players Found Matching Your Query
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            groupedPositions.map((position) => (
                                <Fragment key={position}>
                                    <tr className={styles.categoryDividerRow}>
                                        <td
                                            colSpan={8}
                                            className={
                                                styles.categoryDividerName
                                            }
                                        >
                                            {getPositionHeader(position)}
                                        </td>
                                    </tr>
                                    {groupedPlayers[position].map((player) => (
                                        <tr
                                            key={`${player.name}-${player.number}`}
                                            className={styles.dbRow}
                                        >
                                            <td className={styles.dbNumberCell}>
                                                #{player.number}
                                            </td>
                                            <td className={styles.dbNameCell}>
                                                {player.name}
                                            </td>
                                            <td className={styles.dbPosCell}>
                                                <span
                                                    className={
                                                        styles.dbPosBadge
                                                    }
                                                >
                                                    {player.position}
                                                </span>
                                            </td>
                                            <td>{player.height}</td>
                                            <td>{player.weight} lbs</td>
                                            <td>{player.age || "-"}</td>
                                            <td>
                                                {player.exp === "R"
                                                    ? "R"
                                                    : `${player.exp} yrs`}
                                            </td>
                                            <td
                                                className={styles.dbCollegeCell}
                                            >
                                                {player.college}
                                            </td>
                                        </tr>
                                    ))}
                                </Fragment>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Mobile card view */}
            <div className={styles.mobileCardList}>
                {players.length === 0 ? (
                    <div className={styles.noResultsCell}>
                        <User size={32} className={styles.noResultsIcon} />
                        <div>No Players Found Matching Your Query</div>
                    </div>
                ) : (
                    groupedPositions.map((position) => (
                        <div
                            key={position}
                            className={styles.mobileCategoryGroup}
                        >
                            <div className={styles.mobileCategoryTitle}>
                                {getPositionHeader(position)}
                            </div>
                            {groupedPlayers[position].map((player) => (
                                <div
                                    key={`${player.name}-${player.number}`}
                                    className={styles.mobilePlayerCard}
                                >
                                    <div
                                        className={styles.mobilePlayerCardTop}
                                    >
                                        <span className={styles.dbNumberCell}>
                                            #{player.number}
                                        </span>
                                        <span
                                            className={styles.mobilePlayerName}
                                        >
                                            {player.name}
                                        </span>
                                        <span className={styles.dbPosBadge}>
                                            {player.position}
                                        </span>
                                    </div>
                                    <div
                                        className={
                                            styles.mobilePlayerCardMeta
                                        }
                                    >
                                        <span>{player.height}</span>
                                        <span>{player.weight} lbs</span>
                                        <span>{player.age || "-"}</span>
                                        <span>
                                            {player.exp === "R"
                                                ? "R"
                                                : `${player.exp} yrs`}
                                        </span>
                                        <span>{player.college}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}