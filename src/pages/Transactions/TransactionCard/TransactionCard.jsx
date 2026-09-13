import ContentCutIcon from "@mui/icons-material/ContentCut";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import DiscountIcon from "@mui/icons-material/Discount";
import EditDocumentIcon from "@mui/icons-material/EditDocument";
import SummarizeIcon from "@mui/icons-material/Summarize";
import PlaceholderImage from "@/assets/prospect-placeholder.png";
import styles from "./TransactionCard.module.css";

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
    // No linked player yet is how an in-progress transaction stays off the
    // live site while it's still being drafted in the admin — a real
    // safeguard, not an oversight. Roundup posts are the one deliberate
    // exception: they're never tied to a single player by design.
    const firstPlayer = props.players?.[0];
    if (!firstPlayer && props.type !== "roundup") return null;

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
          }).format(new Date(props.date))
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
