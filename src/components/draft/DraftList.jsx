import React from "react";
import DraftCard from "./DraftCard";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import styles from "./DraftList.module.css";

export default function DraftList(props) {
    return (
        <div id='draftList' className={styles.draftList}>
            <div className={styles.draftCards}>
                {props.players && props.players.length > 0 ? (
                    props.players.map((player) => (
                        <DraftCard key={player.id} {...player} />
                    ))
                ) : (
                    <p>No one drafted yet!</p>
                )}
            </div>
        </div>
    );
}
