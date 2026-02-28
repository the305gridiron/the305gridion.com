import React from "react";
import TradeAlert from "./TradeAlert";
import PlayerAnalysis from "./PlayerAnalysis";
import PlayerDetails from "./PlayerDetails";
import PlayerMeta from "./PlayerMeta";
import styles from "./DraftCard.module.css";

export default function DraftCard(props) {
    return (
        <div className={`draft-card ${styles.draftCard}`}>
            {props.trade && <TradeAlert {...props.trade} />}

            <PlayerDetails {...props.details} />

            <PlayerAnalysis
                id={`${props.meta.round}${props.meta.roundPick}${props.meta.overallPick}`}
                {...props.analysis}
            />

            <PlayerMeta {...props.meta} />
        </div>
    );
}
