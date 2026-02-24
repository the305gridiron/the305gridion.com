import { useState } from "react";
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';
import styles from "./DraftRankings.module.css";

const RankingsListItem = (props) => {
    const [isHidden, setIsHidden] = useState(true);
    return (
        <button className={styles.rankingsListItem} onClick={() => setIsHidden(!isHidden)}>
            <div className={`${styles.rankingsListItemHidden} ${!isHidden ? styles.revealed : ""}`}>
                Number {props.rank}
            </div>
            <div className={styles.rankingsListItemRevealed}>
                <span className={styles.playerRank}>{props.rank}</span>
                <span className={styles.playerName}>{props.name}</span>
            </div>
        </button>
    );
}

const joshTopFive = ["De'Von Achane", "Tua Tagovailoa", "Jaylen Waddle", "Christian Wilkins", "Jevon Holland"];
const joshBotFive = ["Dion Jordan", "Charles Harris", "Noah Igbinoghene", "Austin Jackson", "Raekwon McMillan"];
const anthonyTopFive = ["Xavien Howard", "Minkah Fitzpatrick", "Laremy Tunsil", "Jaylen Waddle", "De'Von Achane"];
const anthonyBotFive = ["Tua Tagovailoa", "Jaelan Phillips", "Austin Jackson", "Charles Harris", "Noah Igbinoghene"];


export default function DraftRankings() {
    return (
        <div className={styles.draftRankings}>
            <div className={styles.rankings}>
                <div className={styles.rankingsWrapper}>
                    <h2>Josh's Top 5 Draft HITS <RocketLaunchIcon /></h2>
                    <div className={styles.rankingsList}>
                        {joshTopFive.map((rank, i) => <RankingsListItem name={rank} rank={i + 1} key={`josh-top-${rank}-${i}`} />)}
                    </div>
                </div>
                <div className={styles.rankingsWrapper}>
                    <h2>Josh's Top 5 Draft MISSES <ReportGmailerrorredIcon /></h2>
                    <div className={styles.rankingsList}>
                        {joshBotFive.map((rank, i) => <RankingsListItem name={rank} rank={i + 1} key={`josh-bot-${rank}-${i}`} />)}
                    </div>
                </div>
                <div className={styles.rankingsWrapper}>
                    <h2>Anthony's Top 5 Draft HITS <RocketLaunchIcon /></h2>
                    <div className={styles.rankingsList}>
                        {anthonyTopFive.map((rank, i) => <RankingsListItem name={rank} rank={i + 1} key={`anthony-top-${rank}-${i}`} />)}
                    </div>
                </div>
                <div className={styles.rankingsWrapper}>
                    <h2>Anthony's Top 5 Draft MISSES <ReportGmailerrorredIcon /></h2>
                    <div className={styles.rankingsList}>
                        {anthonyBotFive.map((rank, i) => <RankingsListItem name={rank} rank={i + 1} key={`anthony-bot-${rank}-${i}`} />)}
                    </div>
                </div>
            </div>
        </div>
    );
}