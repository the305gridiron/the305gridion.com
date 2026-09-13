import ContentCutIcon from "@mui/icons-material/ContentCut";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import DiscountIcon from "@mui/icons-material/Discount";
import EditDocumentIcon from "@mui/icons-material/EditDocument";
import SummarizeIcon from "@mui/icons-material/Summarize";
import PlaceholderImage from "@/assets/prospect-placeholder.png";
import styles from "./TransactionCard.module.css";

// transactions.date is a plain "YYYY-MM-DD" string. new Date("2026-05-30")
// parses that as UTC midnight, which rolls back to May 29 the moment it's
// formatted in any US timezone — this parses it as a local calendar date
// instead, sidestepping that shift entirely.
function parseDateOnly(dateStr) {
    const [year, month, day] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day);
}

function FormattedTitle({ playerPosition, playerName, transactionTypeText }) {
    return (
        <>
            {playerPosition || "POS"}{" "}
            <span className={styles.playerName}>
                {playerName || "Player Name"}
            </span>{" "}
            {transactionTypeText}
        </>
    );
}

const transactionTypeMap = {
    release: { icon: ContentCutIcon, text: "Released" },
    sign: { icon: PersonAddIcon, text: "Signed" },
    trade_away: { icon: SwapHorizIcon, text: "Traded" },
    trade_for: { icon: SwapHorizIcon, text: "Acquired" },
    tender: { icon: PersonAddIcon, text: "Tendered" },
    restructure: { icon: EditDocumentIcon, text: "Restructures Contract" },
    re_sign: { icon: PersonAddIcon, text: "Re-Signed" },
    udfa: { icon: DiscountIcon, text: "UDFA" },
    extension: { icon: EditDocumentIcon, text: "Signs Extension" },
    roundup: { icon: SummarizeIcon, text: "Roundup" },
};

export default function TransactionCard(props) {
    // Draft-vs-published is handled upstream now (Transactions.jsx filters
    // to active: true before this ever renders) — this stays a pure
    // presentational component, so a roundup post (or anything else with no
    // single "main" player) doesn't need a special case here anymore.
    const firstPlayer = props.players?.[0];

    const {
        name: player_name,
        position: player_position,
        image: player_image,
    } = firstPlayer ?? {};

    const Icon = transactionTypeMap?.[props.type]?.icon;

    const formattedDate = props.date
        ? new Intl.DateTimeFormat("en-US", {
              month: "short",
              day: "numeric",
          }).format(parseDateOnly(props.date))
        : "";

    return (
        <div className={`transaction-card ${styles.transactionCard}`}>
            <figure className={styles.playerImage}>
                <img
                    src={props.image_url || player_image || PlaceholderImage}
                    alt={props.image_description || player_name}
                />
            </figure>

            <div className={styles.transactionAnalysis}>
                <h3 className={styles.transactionHeadline}>
                    {props.title ? (
                        props.title
                    ) : (
                        <FormattedTitle
                            playerPosition={player_position}
                            playerName={player_name}
                            transactionTypeText={
                                transactionTypeMap[props.type]?.text
                            }
                        />
                    )}
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
