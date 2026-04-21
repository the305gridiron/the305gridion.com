import PlaceholderImage from "@/assets/prospect-placeholder.png";
import styles from "./PlayerDetails.module.css";

export default function PlayerDetails(props) {
    return (
        <div className={styles.playerDetails}>
            <h3 className={`${styles.playerName} player-name`}>
                <span className={styles.playerPosition}>
                    {props.position || "POS"}
                </span>{" "}
                {props.name || "Player Name"}
            </h3>
            <figure className={`${styles.playerImage} player-image`}>
                <img src={props.image || PlaceholderImage} alt={props.name} />
            </figure>
        </div>
    );
}
