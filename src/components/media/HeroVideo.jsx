import React from "react";
import YoutubeEmbed from "./YoutubeEmbed";
import styles from "./HeroVideo.module.css";
import { GitPullRequestArrow, GraduationCap } from "lucide-react";

export default function HeroVideo({ video }) {
    if (!video) return null;

    return (
        <section className={styles.heroVideo}>
            <div className='container'>
                <div className={styles.videoWrapper}>
                    <YoutubeEmbed
                        videoId={video.videoId}
                        thumbnail={video.thumbnail}
                        title={video.title.replace("&amp;", "&")}
                        thumbnailStyles={{ border: 0 }}
                        autoplay={video.isLive}
                    />
                </div>
                <div className={styles.videoDetails}>
                    <h2 className={styles.title}>
                        {video.title.replace("|", "").replace("&amp;", "&")}
                    </h2>
                    <p className={styles.description}>
                        {video?.description?.split("📢")[0]}
                    </p>
                </div>
            </div>
        </section>
    );
}
