import TradeAlert from "./TradeAlert";
import PlayerAnalysis from "./PlayerAnalysis";
import PlayerDetails from "./PlayerDetails";
import PlayerMeta from "./PlayerMeta";
import styles from "./DraftCard.module.css";

export default function DraftCard(props) {
    const details = {
        position: props?.player?.position,
        name: props?.player?.name,
        image: props?.player?.image,
    };
    const meta = {
        grade: props?.grade ?? props?.draft_grade,
        fit: props?.fit ?? props.draft_fit,
        round: props?.round,
        roundPick: props?.round_pick,
        overallPick: props?.overall_pick,
        school: props?.player?.school?.abbr,
        height: props?.player?.height,
        weight: props?.player?.weight,
    };
    return (
        <div className={`draft-card ${styles.draftCard}`}>
            {props.trade && <TradeAlert {...props.trade} />}

            <PlayerDetails {...details} />

            <PlayerAnalysis
                id={`${props.round}${props.round_pick}${props.overall_pick}`}
                analysis={props.analysis}
            />

            <PlayerMeta {...meta} />
        </div>
    );
}
