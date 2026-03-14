import { useState } from "react";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import ReportGmailerrorredIcon from "@mui/icons-material/ReportGmailerrorred";
import styles from "./DraftRankings.module.css";

const RankingsListItem = (props) => {
  const [isHidden, setIsHidden] = useState(true);
  return (
    <button
      className={styles.rankingsListItem}
      onClick={() => setIsHidden(!isHidden)}
    >
      <div
        className={`${styles.rankingsListItemHidden} ${!isHidden ? styles.revealed : ""} ${props.alt ? styles.alternate : ""}`}
      >
        Number {props.rank}
      </div>
      <div className={styles.rankingsListItemRevealed}>
        <span className={styles.playerRank}>{props.rank}</span>
        <span className={styles.playerName}>{props.name}</span>
      </div>
    </button>
  );
};

const joshTopFive = [
  "De'Von Achane",
  "Laremy Tunsil",
  "Minkah Fitzpatrick",
  "Christian Wilkins",
  "Xavien Howard",
];
const joshBotFive = [
  "Dion Jordan",
  "Charles Harris",
  "Noah Igbinoghene",
  "Austin Jackson",
  "Raekwon McMillan",
];
const anthonyTopFive = [
  "Xavien Howard",
  "Minkah Fitzpatrick",
  "Laremy Tunsil",
  "Jaylen Waddle",
  "De'Von Achane",
];
const anthonyBotFive = [
  "Tua Tagovailoa",
  "Jaelan Phillips",
  "Austin Jackson",
  "Charles Harris",
  "Noah Igbinoghene",
];

export default function DraftRankings() {
  return (
    <div className={styles.draftRankings}>
      <h2>Top 5 Hits &amp; Misses of the Chris Grier Era</h2>
      <div className={styles.rankings}>
        <div className={styles.rankingsWrapper}>
          <h3>
            Josh's Draft HITS <RocketLaunchIcon />
          </h3>
          <div className={styles.rankingsList}>
            {joshTopFive.map((rank, i) => (
              <RankingsListItem
                name={rank}
                rank={i + 1}
                key={`josh-top-${rank}-${i}`}
              />
            ))}
          </div>
        </div>
        <div className={styles.rankingsWrapper}>
          <h3>
            Josh's Draft MISSES <ReportGmailerrorredIcon />
          </h3>
          <div className={styles.rankingsList}>
            {joshBotFive.map((rank, i) => (
              <RankingsListItem
                name={rank}
                rank={i + 1}
                key={`josh-bot-${rank}-${i}`}
                alt={true}
              />
            ))}
          </div>
        </div>
        <div className={styles.rankingsWrapper}>
          <h3>
            Anthony's Draft HITS <RocketLaunchIcon />
          </h3>
          <div className={styles.rankingsList}>
            {anthonyTopFive.map((rank, i) => (
              <RankingsListItem
                name={rank}
                rank={i + 1}
                key={`anthony-top-${rank}-${i}`}
              />
            ))}
          </div>
        </div>
        <div className={styles.rankingsWrapper}>
          <h3>
            Anthony's Draft MISSES <ReportGmailerrorredIcon />
          </h3>
          <div className={styles.rankingsList}>
            {anthonyBotFive.map((rank, i) => (
              <RankingsListItem
                name={rank}
                rank={i + 1}
                key={`anthony-bot-${rank}-${i}`}
                alt={true}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
