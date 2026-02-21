import React from "react";
import SidebarPlayerPanel from "./SidebarPlayerPanel";
import Tooltip from "@mui/material/Tooltip";
import SwapHorizOutlinedIcon from "@mui/icons-material/SwapHorizOutlined";
import styles from "./SidebarCard.module.scss";

function SidebarCard(props) {
    const [expanded, setExpanded] = React.useState(false);

    const handleChange = (panelId) => {
        setExpanded((prev) => (prev === panelId ? false : panelId));
    };

    const getEmptyMessage = (title) => {
        switch (title) {
            case "Additions":
                return "No new Dolphins yet... maybe they're still swimming in free agency waters. Check back March 11, 2026!";
            case "Resignings":
                return "Nobody's re-signed yet. Don't worry, Sully and Haf haven't had their morning coffee yet, they'll get to it!";
            case "Losses":
                return "Roster intact! No cuts, no trades... your Dolphins are still all here (for now).";
            case "Undrafted":
                return "Undrafted free agents are lurking in the shadows... they can't join the squad until the draft ends. Patience, young grasshopper!"
        }
    }


    if (props.players.length === 0) {
        return (
            <div className={styles.sidebarCard}>
                <h3 className={styles.sidebarCardTitle}>{props.title}</h3>
                <p className={styles.emptyMessage}>
                    {getEmptyMessage(props.title)}
                </p>
            </div>
        );
    }

    return (
        <div className={styles.sidebarCard}>
            <h3 className={styles.sidebarCardTitle}>{props.title}</h3>
            <div
                className={`${styles.sidebarCardList} ${props.title === "Additions"
                    ? styles.sidebarCardListAdditions
                    : ""
                    }`}
            >
                {props.players
                    .slice(0)
                    .reverse()
                    .map((player) => {
                        const playerEl =
                            props.title === "Additions" ? (
                                <SidebarPlayerPanel
                                    {...player}
                                    key={player.id}
                                    expanded={expanded === `panel${player.id}`}
                                    onToggle={() => handleChange(`panel${player.id}`)}
                                />
                            ) : (
                                <div
                                    className={`${styles.sidebarCardListItem}${props.title === "Undrafted"
                                        ? ` ${styles.sidebarCardListItemUndrafted}`
                                        : ""
                                        }`}
                                    key={player.id}
                                >
                                    <span className={styles.playerPosition}>
                                        {player.position}
                                    </span>{" "}
                                    {player.name}
                                    {player.trade && (
                                        <Tooltip
                                            title={player.tradeDetails}
                                            placement="top-end"
                                        >
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
                            );
                        return playerEl;
                    })}
            </div>
        </div>
    );
}

export default SidebarCard;
