import React from "react";
import SidebarPlayerPanel from "./SidebarPlayerPanel";
import Tooltip from "@material-ui/core/Tooltip";
import SwapHorizOutlinedIcon from "@material-ui/icons/SwapHorizOutlined";
import styles from "./SidebarCard.module.scss";

function SidebarCard(props) {
    const [expanded, setExpanded] = React.useState();

    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };

    return (
        <div className={styles.sidebarCard}>
            <h3 className={styles.sidebarCardTitle}>{props.title}</h3>
            <div
                className={`${styles.sidebarCardList} ${
                    props.title === "Additions"
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
                                    expanded={expanded}
                                    handleChange={handleChange}
                                />
                            ) : (
                                <div
                                    className={`${styles.sidebarCardListItem}${
                                        props.title === "Undrafted"
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
