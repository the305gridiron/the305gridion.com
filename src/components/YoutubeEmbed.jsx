import { useState } from "react";
import styles from "./YoutubeEmbed.module.css";

export default function YoutubeEmbed({ videoId, thumbnail, title, thumbnailStyles = {} }) {
    const [play, setPlay] = useState(false);

    return (
        <div className={styles.ytEmbed} onClick={() => setPlay(true)}>
            {play ? (
                <iframe
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                    title={title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            ) : (
                <div className={styles.ytThumbnail} style={thumbnailStyles}>
                    <img src={thumbnail} alt={title} />
                    <div className={styles.playButton}>▶</div>
                </div>
            )}
        </div>
    );
}
