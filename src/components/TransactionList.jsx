import React from "react";
import TransactionCard from "./TransactionCard";
import IconHeader from "./IconHeader";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";

import styles from "./TransactionList.module.css";

export default function TransactionList(props) {
    return (
        <div id='transactionList' className={styles.transactionList}>
            <IconHeader
                icon={<TrendingUpOutlinedIcon />}
                title='Transactions'
            />
            <div className={styles.transactionCards}>
                {props.players && props.players.length > 0 ? (
                    props.players.map((player) => (
                        <TransactionCard key={player.id} {...player} />
                    ))
                ) : (
                    <p>No transactions to report just yet!</p>
                )}
            </div>
        </div>
    );
}
