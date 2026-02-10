// netlify/functions/youtube.js
import axios from "axios";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_PLAYLIST_ID = process.env.YOUTUBE_PLAYLIST_ID;
const API_URL = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=20&playlistId=${YOUTUBE_PLAYLIST_ID}&key=${YOUTUBE_API_KEY}`;

const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours
let cachedData = null;
let cachedAt = 0;

export async function handler(event) {
    const forceRefresh = event.queryStringParameters?.force === "true";

    const isCacheValid = cachedData && Date.now() - cachedAt < CACHE_TTL;

    if (!forceRefresh && isCacheValid) {
        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(cachedData),
        };
    }

    try {
        const response = await axios.get(API_URL);
        const videos = response.data.items
            ?.filter(v =>
                v?.snippet?.resourceId?.videoId &&
                v?.snippet?.title !== "Private video" &&
                v?.snippet?.title !== "Deleted video" &&
                v?.snippet?.liveBroadcastContent !== "upcoming"
            )
            .map(video => ({
                videoId: video.snippet.resourceId.videoId,
                title: video.snippet.title,
                description: video.snippet.description,
                thumbnail: video.snippet.thumbnails?.high?.url,
                publishedAt: video.snippet.publishedAt
            }))
            .slice(0, 10);


        cachedData = videos;
        cachedAt = Date.now();

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(videos),
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ error: "Failed to fetch videos" }),
        };
    }
}
