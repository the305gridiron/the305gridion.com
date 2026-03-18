// netlify/functions/youtube.js
import axios from "axios";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_PLAYLIST_ID = process.env.YOUTUBE_PLAYLIST_ID;
const YOUTUBE_CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;

const PLAYLIST_URL = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=20&playlistId=${YOUTUBE_PLAYLIST_ID}&key=${YOUTUBE_API_KEY}`;
const LIVE_URL = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${YOUTUBE_CHANNEL_ID}&eventType=live&type=video&key=${YOUTUBE_API_KEY}`;

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
        // fetch uploads + live status in parallel
        const [playlistResponse, liveResponse] = await Promise.all([
            axios.get(PLAYLIST_URL),
            axios.get(LIVE_URL)
        ]);

        const liveItem = liveResponse.data.items?.[0];
        const liveVideoId = liveItem?.id?.videoId;
        const liveStream = liveItem
            ? {
                videoId: liveVideoId,
                title: liveItem.snippet.title,
                description: liveItem.snippet.description,
                thumbnail: liveItem.snippet.thumbnails?.maxres?.url ||
                    liveItem.snippet.thumbnails?.high?.url ||
                    liveItem.snippet.thumbnails?.medium?.url,
                isLive: true
            }
            : null;

        const videos = playlistResponse.data.items
            ?.filter(v => {
                const videoId = v?.snippet?.resourceId?.videoId;
                return (
                    videoId &&
                    v?.snippet?.title !== "Private video" &&
                    v?.snippet?.title !== "Deleted video" &&
                    v?.snippet?.liveBroadcastContent !== "upcoming" &&
                    (!liveVideoId || videoId !== liveVideoId)
                )
            })
            .map(video => ({
                videoId: video.snippet.resourceId.videoId,
                title: video.snippet.title,
                description: video.snippet.description,
                thumbnail: video.snippet.thumbnails?.maxres?.url ||
                    video.snippet.thumbnails?.high?.url ||
                    video.snippet.thumbnails?.medium?.url,
                publishedAt: video.snippet.publishedAt
            }))
            .slice(0, 10);

        const responsePayload = {
            liveStream,
            videos
        };

        cachedData = responsePayload;
        cachedAt = Date.now();

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(responsePayload),
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
