import { useState } from "react";
import styles from "./YoutubeEmbed.module.css";

export default function YoutubeEmbed({
    videoId,
    thumbnail,
    title,
    thumbnailStyles = {},
    autoplay = false
}) {
    const [play, setPlay] = useState(autoplay);

    const src = `https://www.youtube.com/embed/${videoId}?autoplay=${play ? 1 : 0}&mute=${autoplay ? 1 : 0}&rel=0&modestbranding=1&playsinline=1`;

    return (
        <div
            className={styles.ytEmbed}
            onClick={!play ? () => setPlay(true) : undefined}
        >
            {play ? (
                <iframe
                    src={src}
                    title={title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            ) : (
                <div className={styles.ytThumbnail} style={thumbnailStyles}>
                    <img src={thumbnail} alt={title} />
                    <div className={styles.playButton}>▶</div>
                </div>
            )}
        </div>
    );
}
