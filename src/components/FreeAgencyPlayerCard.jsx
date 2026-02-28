import React from "react";
import SidebarCard from "./SidebarCard";
import SidebarPlayerPanel from "./SidebarPlayerPanel";
import Tooltip from "@mui/material/Tooltip";
import SwapHorizOutlinedIcon from "@mui/icons-material/SwapHorizOutlined";
import styles from "./SidebarCard.module.css";

export default function FreeAgencyPlayerCard({ title, players, messaging }) {
    const [expanded, setExpanded] = React.useState(false);

    const handleChange = (panelId) => {
        setExpanded((prev) => (prev === panelId ? false : panelId));
    };

    if (!players || players.length === 0) {
        return (
            <SidebarCard title={title} tooltip={messaging.tooltip}>
                <p className={styles.emptyMessage}>{messaging.empty}</p>
            </SidebarCard>
        );
    }

    const playerList = title === "Unsigned" ? players : [...players].reverse();

    return (
        <SidebarCard title={title} tooltip={messaging.tooltip}>
            <div className={styles.sidebarCardList}>
                {playerList.map((player) =>
                    title === "Additions" ? (
                        <SidebarPlayerPanel
                            {...player}
                            key={player.id}
                            expanded={expanded === player.id}
                            onToggle={() => handleChange(player.id)}
                        />
                    ) : (
                        <div
                            key={player.id}
                            className={styles.sidebarCardListItem}
                        >
                            {player.position && (
                                <span className={styles.playerPosition}>
                                    {player.position}
                                </span>
                            )}

                            {player.name}

                            {player.trade && (
                                <Tooltip title={player.tradeDetails}>
                                    <SwapHorizOutlinedIcon
                                        className={styles.tradeIcon}
                                    />
                                </Tooltip>
                            )}

                            {player.school && (
                                <span className={styles.playerSchool}>
                                    {player.school}
                                </span>
                            )}
                        </div>
                    ),
                )}
            </div>
        </SidebarCard>
    );
}
