import ContentCutIcon from "@mui/icons-material/ContentCut";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import DiscountIcon from '@mui/icons-material/Discount';
import EditDocumentIcon from "@mui/icons-material/EditDocument";
import PlaceholderImage from "@/assets/prospect-placeholder.png";
import styles from "./TransactionCard.module.css";

const transactionTypeMap = {
    release: { icon: ContentCutIcon, text: "Released" },
    sign: { icon: PersonAddIcon, text: "Signed" },
    trade_away: { icon: SwapHorizIcon, text: "Traded" },
    trade_for: { icon: SwapHorizIcon, text: "Acquired" },
    tender: { icon: PersonAddIcon, text: "Tendered" },
    restructure: { icon: EditDocumentIcon, text: "Restructures Contract" },
    re_sign: { icon: PersonAddIcon, text: "Re-Signed" },
    udfa: { icon: DiscountIcon, text: "UDFA" }
};

export default function TransactionCard(props) {
    const {
        name: player_name,
        position: player_position,
        image: player_image,
    } = props.players[0];

    const Icon = transactionTypeMap?.[props.type]?.icon;

    const formattedDate = props.date
        ? new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
        }).format(new Date(props.date))
        : "";

    const FormattedTitle = () => (
        <>
            {player_position || "POS"}{" "}
            <span className={styles.playerName}>
                {player_name || "Player Name"}
            </span>{" "}
            {transactionTypeMap[props.type]?.text}
        </>
    );

    return (
        <div className={`transaction-card ${styles.transactionCard}`}>
            <figure className={styles.playerImage}>
                <img src={props.image_url || player_image || PlaceholderImage} alt={props.image_description || player_name} />
            </figure>

            <div className={styles.transactionAnalysis}>
                <h3 className={styles.transactionHeadline}>
                    {props.title ? props.title : <FormattedTitle />}
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
