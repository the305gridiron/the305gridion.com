import React from "react";
import PlaceholderImage from "../assets/prospect-placeholder.png";
import ContentCutIcon from "@mui/icons-material/ContentCut";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import styles from "./TransactionCard.module.css";

export default function TransactionCard(props) {
    const typeMap = {
        release: { icon: <ContentCutIcon />, text: "Released" },
        addition: { icon: <PersonAddIcon />, text: "Signed" },
        trade: { icon: <SwapHorizIcon />, text: "Traded" },
    };

    return (
        <div className={`transaction-card ${styles.transactionCard}`}>
            <figure className={styles.playerImage}>
                <img src={props.image || PlaceholderImage} alt={props.name} />
            </figure>

            <div className={styles.transactionAnalysis}>
                <h3 className={styles.transactionHeadline}>
                    {props.position || "POS"}&nbsp;
                    <span className={styles.playerName}>
                        {props.name || "Player Name"}
                    </span>
                    &nbsp;
                    {typeMap[props.type]?.text}
                </h3>
                <p>{props.analysis}</p>
            </div>

            <span
                className={`${styles.type} ${styles[props.type]}`}
                aria-label={typeMap[props.type]?.text}
            >
                {typeMap[props.type]?.icon}
            </span>
        </div>
    );
}
