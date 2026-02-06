import React from "react";
// import PlaceholderImage from "../images/prospect-placeholder.png";
import styles from "./PlayerDetails.module.scss";

export default function PlayerDetails(props) {
    return (
        <div className={styles.playerDetails}>
            <h3 className={styles.playerName}>
                <span className={styles.playerPosition}>
                    {props.position ? props.position : "Position"}
                </span>{" "}
                {props.name ? props.name : "Player Name"}
            </h3>
            {/* 
            REMOVED 6/14 DUE TO NFL.COM REMOVING IMAGES
            <figure className="player-image">
                <img
                    src={props.image ? props.image : PlaceholderImage}
                    alt={props.name}
                />
            </figure> */}
        </div>
    );
}
