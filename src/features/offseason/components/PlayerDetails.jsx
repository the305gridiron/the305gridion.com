import PlaceholderImage from "../images/prospect-placeholder.png";
import styles from "./PlayerDetails.module.scss";

export default function PlayerDetails(props) {
    return (
        <div className={styles.playerDetails}>
            <h3 className={styles.playerName}>
                <span className={styles.playerPosition}>
                    {props.position || "POS"}
                </span>{" "}
                {props.name || "Player Name"}
            </h3>
            <figure className={styles.playerImage}>
                <img
                    src={props.image || PlaceholderImage}
                    alt={props.name}
                />
            </figure>
        </div>
    );
}
