import React from "react";
import Tooltip from "@mui/material/Tooltip";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import styles from "./PlayerMeta.module.scss";

export default function PlayerMeta(props) {
    const nflTotalScore = 8.0;
    return (
        <ul className={styles.playerMeta}>
            <li className="player-meta--grade">
                <span className={styles.playerMetaTitle}>
                    Grade
                    {/* <Tooltip
                        title="NFL.com grades their prospects out of 8.0, I normalized the numbers to out of 100 to match other sites."
                        placement="right"
                    >
                        <InfoOutlinedIcon />
                    </Tooltip> */}
                </span>
                {props.grade
                    ? props.grade
                    : "--"}
            </li>
            <li className="player-meta--grade">
                <span className={styles.playerMetaTitle}>Fit</span>
                {props.fit ? props.fit : "--"}
            </li>
            <li className="player-meta--round">
                <span className={styles.playerMetaTitle}>Round</span>
                {props.round ? props.round : "--"}
            </li>
            <li className="player-meta--round-pick">
                <span className={styles.playerMetaTitle}>Rnd Pick</span>
                {props.roundPick ? props.roundPick : "--"}
            </li>
            <li className="player-meta--overall-pick">
                <span className={styles.playerMetaTitle}>Ovr Pick</span>
                {props.overallPick ? props.overallPick : "--"}
            </li>
            <li className={styles.playerMetaSchool}>
                <span className={styles.playerMetaTitle}>School</span>
                {props.school ? props.school : "--"}
            </li>
            <li className="player-meta--height">
                <span className={styles.playerMetaTitle}>Height</span>{" "}
                {props.height ? props.height : "--"}
            </li>
            <li className="player-meta--weight">
                <span className={styles.playerMetaTitle}>Weight</span>
                {props.weight ? `${props.weight} lbs` : "--"}
            </li>
        </ul>
    );
}
