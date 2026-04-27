import React from "react";
import SidebarCard from "./SidebarCard";
import SidebarPlayerPanel from "./SidebarPlayerPanel";
import Tooltip from "@mui/material/Tooltip";
import SwapHorizOutlinedIcon from "@mui/icons-material/SwapHorizOutlined";
import styles from "./SidebarCard.module.css";

function formatUnsignedPlayers(players) {
    return players.map(p => ({
        id: p.id,
        position: p.player.position,
        name: p.player.name,
        deal: p.team_id ? { team: p.team.abbr } : null
    })).sort((a, b) => a.id - b.id);
}

export default function FreeAgencyPlayerCard({ hideTitle = false, title, players, messaging }) {
    const [expanded, setExpanded] = React.useState(false);

    const handleChange = (panelId) => {
        setExpanded((prev) => (prev === panelId ? false : panelId));
    };

    if (!players || players.length === 0) {
        return (
            <SidebarCard>
                {!hideTitle && title && (
                    <SidebarCard.Title>{title}</SidebarCard.Title>
                )}
                <p className={styles.emptyMessage}>{messaging.empty}</p>
            </SidebarCard>
        );
    }

    const playerList = title === "Unsigned" ? formatUnsignedPlayers(players) : [...players].reverse();

    return (
        <SidebarCard>
            {!hideTitle && title && (
                <SidebarCard.Title>{title}</SidebarCard.Title>
            )}
            <SidebarCard.List>
                {playerList.map((player) =>
                    title === "Additions" ? (
                        <SidebarPlayerPanel
                            {...player}
                            key={player.id}
                            expanded={expanded === player.id}
                            onToggle={() => handleChange(player.id)}
                        />
                    ) : (
                        <SidebarCard.ListItem key={player.id}>
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
                                    {typeof player.school === "string" ? player.school : player.school.abbr}
                                </span>
                            )}

                            {player.deal && (
                                <Tooltip title={player.deal.details} className={styles.playerDeal}>
                                    {player.deal.team}
                                </Tooltip>
                            )}
                        </SidebarCard.ListItem>
                    ),
                )}
            </SidebarCard.List>
        </SidebarCard>
    );
}
