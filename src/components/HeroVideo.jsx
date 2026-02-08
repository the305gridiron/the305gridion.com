import React from "react";
import YoutubeEmbed from "./YoutubeEmbed";
import styles from "./HeroVideo.module.css";
import { GitPullRequestArrow, GraduationCap } from "lucide-react";

export default function HeroVideo({ video }) {
    if (!video) return null;

    return (
        <section className={styles.heroVideo}>
            <div className="container">
                <div className={styles.videoWrapper}>
                    <YoutubeEmbed
                        videoId={video.videoId}
                        thumbnail={video.thumbnail}
                        title={video.title}
                        thumbnailStyles={{ border: 0 }}
                    />
                </div>
                <div className={styles.videoDetails}>
                    <h2 className={styles.title}>{video.title}</h2>
                    <p className={styles.description}>{video.description.split("📢")[0]}</p>
                    <div className={styles.heroCTA}>
                        <a className={styles.heroButton} href="https://www.youtube.com/playlist?list=PLxSEosyZR98Psz7lXdABd7gJ7JynnIkYm" target="_blank" rel="noopener noreferrer">
                            <span className={styles.buttonIcon}><GraduationCap /></span> Checkout Our<br />2025 Position Grades
                        </a>
                        <a className={styles.heroButton} href="https://www.youtube.com/playlist?list=PLxSEosyZR98OToPtZ4JcSFPkqGbGc3Q6u" target="_blank" rel="noopener noreferrer">
                            <span className={styles.buttonIcon}><GitPullRequestArrow /></span> Get More 2026<br />Offseason Content
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
