import { transactionTypeMap } from "../data/transactions";
import PlaceholderImage from "../assets/prospect-placeholder.png";
import styles from "./TransactionCard.module.css";

export default function TransactionCard(props) {
    const Icon = transactionTypeMap[props.type].icon;
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
                    {transactionTypeMap[props.type]?.text}
                </h3>
                <p>{props.analysis}</p>
                {props.update && <p className={styles.transactionUpdate}>{props.update}</p>}
            </div>

            <span
                className={`${styles.type} ${styles[props.type]}`}
                aria-label={transactionTypeMap[props.type]?.text}
            >
                <Icon />
            </span>
        </div>
    );
}
