import { transactionTypeMap } from "@/data/transactions";
import PlaceholderImage from "@/assets/prospect-placeholder.png";
import styles from "./TransactionCard.module.css";

export default function TransactionCard(props) {
    const Icon = transactionTypeMap?.[props.type]?.icon;

    const formattedDate = props.date
        ? new Intl.DateTimeFormat("en-US", {
              month: "short",
              day: "numeric",
          }).format(new Date(props.date))
        : "";
    return (
        <div className={`transaction-card ${styles.transactionCard}`}>
            <figure className={styles.playerImage}>
                <img src={props.image || PlaceholderImage} alt={props.name} />
            </figure>

            <div className={styles.transactionAnalysis}>
                <h3 className={styles.transactionHeadline}>
                    {props.position || "POS"}{" "}
                    <span className={styles.playerName}>
                        {props.name || "Player Name"}
                    </span>{" "}
                    {transactionTypeMap[props.type]?.text}
                </h3>
                <p className={styles.transactionDate}>{formattedDate}</p>
                <p className={styles.transactionAnalysisContent}>
                    {props.analysis}
                </p>
                {props.update && (
                    <p className={styles.transactionUpdate}>{props.update}</p>
                )}
            </div>

            {Icon && (
                <span
                    className={`${styles.type} ${styles[props.type]}`}
                    aria-label={transactionTypeMap[props.type]?.text}
                >
                    <Icon />
                </span>
            )}
        </div>
    );
}
