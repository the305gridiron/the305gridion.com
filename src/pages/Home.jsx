import React, { useEffect, useState } from "react";
import { fetchYoutubeVideos } from "../services/YoutubeService";
import YouTubeEmbed from "../components/YoutubeEmbed";
import styles from "../styles/Home.module.css";
import HeroVideo from "../components/HeroVideo";

export default function Home() {
    const [youtubeVideos, setYoutubeVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const youtubeVideoData = await fetchYoutubeVideos();
                console.log("Fetched YouTube videos:", youtubeVideoData);
                setYoutubeVideos(youtubeVideoData);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    if (loading) return <p>Loading videos...</p>;

    return (
        <div className={styles.homePage}>
            {youtubeVideos.slice(0, 1).map(video => (
                <HeroVideo key={video.videoId} video={video} />
            ))}
            <div className="container">

                <div className={styles.videoGrid}>
                    {youtubeVideos.slice(1).map(video => (
                        <div className={styles.videoCard} key={video.videoId}>
                            <YouTubeEmbed
                                videoId={video.videoId}
                                title={video.title}
                                thumbnail={video.thumbnail}
                            />
                            <h3 className={styles.videoTitle}>{video.title}</h3>
                            <p className={styles.videoDescription}>{video.description.split("📢")[0]}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
