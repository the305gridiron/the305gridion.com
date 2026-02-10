import React, { useEffect, useState } from "react";
import { fetchYoutubeVideos } from "../services/YoutubeService";
import YouTubeEmbed from "../components/YoutubeEmbed";
import styles from "../styles/Home.module.css";
import HeroVideo from "../components/HeroVideo";
import { ClipLoader } from "react-spinners";

export default function Home() {
    const [heroVideo, setHeroVideo] = useState(null);
    const [youtubeVideos, setYoutubeVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const youtubeData = await fetchYoutubeVideos();
                console.log("Fetched YouTube videos:", youtubeData);

                setHeroVideo(youtubeData.heroVideo ?? youtubeData.videos[0]);

                setYoutubeVideos(youtubeData.heroVideo
                    ? youtubeData.videos
                    : youtubeData.videos.slice(1)
                );
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    if (loading) {
        return (
            <div className="loading">
                <ClipLoader color="#007bff" loading={loading} size={50} />
            </div>
        );
    }

    return (
        <div className={styles.homePage}>
            <HeroVideo video={heroVideo} />

            <div className="container">
                <div className={styles.videoGrid}>
                    {youtubeVideos?.map(video => (
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
