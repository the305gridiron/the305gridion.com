import React from "react";
import SidebarPlayerPanel from "./SidebarPlayerPanel";
import Tooltip from "@mui/material/Tooltip";
import SwapHorizOutlinedIcon from "@mui/icons-material/SwapHorizOutlined";
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';
import styles from "./SidebarCard.module.scss";

function SidebarCard(props) {
    const [expanded, setExpanded] = React.useState(false);

    const handleChange = (panelId) => {
        setExpanded((prev) => (prev === panelId ? false : panelId));
    };

    const getMessaging = (title) => {
        switch (title) {
            case "Additions":
                return {
                    "empty": "No new Dolphins yet... maybe they're still swimming in free agency waters. Check back March 11, 2026!",
                    "tooltip": "Players added from other teams in free agency or through trade."
                }
            case "Resignings":
                return {
                    "empty": "Nobody's re-signed yet. Don't worry, Sully and Haf haven't had their morning coffee yet, they'll get to it!",
                    "tooltip": "Players resigned from last years squad."
                }
            case "Losses":
                return {
                    "empty": "Roster intact! No cuts, no trades... your Dolphins are still all here (for now).",
                    "tooltip": "Players lost to another team in free agency or via trade."
                }
            case "Undrafted":
                return {
                    "empty": "Undrafted free agents are lurking in the shadows... they can't join the squad until the draft ends. Patience, young grasshopper!",
                    "tooltip": "Players signed after the draft who did not get drafted."
                }
            case "Unsigned":
                return {
                    "empty": "Will they return? It's anyone's guess, but they haven't signed on the dotted line just yet.",
                    "tooltip": "Players from last years roster whos contracts have expired."
                }
        }
    }


    if (props.players.length === 0) {
        return (
            <div className={styles.sidebarCard}>
                <h3 className={styles.sidebarCardTitle}>
                    {props.title}
                    <Tooltip
                        title={getMessaging(props.title).tooltip}
                        placement="top-end"
                    >
                        <InfoOutlineIcon
                            className={styles.tradeIcon}
                        />
                    </Tooltip>
                </h3>
                <p className={styles.emptyMessage}>
                    {getMessaging(props.title).empty}
                </p>
            </div>
        );
    }

    const playerList = props.title === "Unsigned" ? props.players.slice(0) : props.players.slice(0).reverse();

    return (
        <div className={styles.sidebarCard}>
            <h3 className={styles.sidebarCardTitle}>
                {props.title}
                <Tooltip
                    title={getMessaging(props.title).tooltip}
                    placement="top-end"
                >
                    <InfoOutlineIcon
                        className={styles.tradeIcon}
                    />
                </Tooltip>
            </h3>
            <div
                className={`${styles.sidebarCardList} ${props.title === "Additions"
                    ? styles.sidebarCardListAdditions
                    : ""
                    }`}
            >
                {playerList.map((player) => {
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
