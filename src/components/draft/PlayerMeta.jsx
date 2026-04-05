import React from "react";
import Tooltip from "@mui/material/Tooltip";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import styles from "./PlayerMeta.module.css";

export default function PlayerMeta(props) {
    return (
        <ul className={styles.playerMeta}>
            <li className='player-meta--grade'>
                <span className={styles.playerMetaTitle}>Grade</span>
                {props.grade ? props.grade : "--"}
            </li>
            <li className='player-meta--fit'>
                <span className={styles.playerMetaTitle}>Fit</span>
                {props.fit ? props.fit : "--"}
            </li>
            <li className='player-meta--round'>
                <span className={styles.playerMetaTitle}>Round</span>
                {props.round ? props.round : "--"}
            </li>
            <li className='player-meta--round-pick'>
                <span className={styles.playerMetaTitle}>Rnd Pick</span>
                {props.roundPick ? props.roundPick : "--"}
            </li>
            <li className='player-meta--overall-pick'>
                <span className={styles.playerMetaTitle}>Ovr Pick</span>
                {props.overallPick ? props.overallPick : "--"}
            </li>
            <li className='player-meta--school'>
                <span className={styles.playerMetaTitle}>School</span>
                {props.school ? props.school : "--"}
            </li>
            <li className='player-meta--height'>
                <span className={styles.playerMetaTitle}>Height</span>{" "}
                {props.height ? props.height : "--"}
            </li>
            <li className='player-meta--weight'>
                <span className={styles.playerMetaTitle}>Weight</span>
                {props.weight ? props.weight : "--"}
            </li>
        </ul>
    );
}
