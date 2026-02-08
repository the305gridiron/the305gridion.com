import axios from "axios";

const YOUTUBE_API_KEY = "AIzaSyBS65xE9YIKht48e9brDo9ijbzBjT_j_Wc";
const YOUTUBE_PLAYLIST_ID = "PLxSEosyZR98P7DvEkl0EBKr3MjtrETAM4";
const API_URL = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=10&playlistId=${YOUTUBE_PLAYLIST_ID}&key=${YOUTUBE_API_KEY}`;
const YOUTUBE_STORAGE_KEY = "youtubeVideos";
const YOUTUBE_CACHE_INVALIDATION_KEY = "youtubeCacheInvalidated";

export const fetchYoutubeVideos = async (forceRefresh = false) => {
    const cacheInvalidated = true;
    // localStorage.getItem(YOUTUBE_CACHE_INVALIDATION_KEY) === "true";

    if (
        !forceRefresh &&
        !cacheInvalidated &&
        localStorage.getItem(YOUTUBE_STORAGE_KEY)
    ) {
        console.log("Returning cached youtube videos");
        return JSON.parse(localStorage.getItem(YOUTUBE_STORAGE_KEY));
    }
    try {
        console.log("YOUTUBE API Hit");
        const response = await axios.get(API_URL);
        const data = response.data;

        const youtubeVideos = data?.items
            ?.filter(v => v?.snippet?.resourceId?.videoId)
            .map(video => ({
                videoId: video.snippet.resourceId.videoId,
                title: video.snippet.title,
                description: video.snippet.description,
                thumbnail: video.snippet.thumbnails?.high?.url,
                publishedAt: video.snippet.publishedAt
            }));


        localStorage.setItem(YOUTUBE_STORAGE_KEY, JSON.stringify(youtubeVideos));
        localStorage.removeItem(YOUTUBE_CACHE_INVALIDATION_KEY);
        return youtubeVideos;
    } catch (error) {
        console.error("Error fetching youtube videos:", error);
        return []; // Return an empty array on error to prevent app crashes
    }
};

export const invalidateYoutubeCache = () => {
    localStorage.setItem(YOUTUBE_CACHE_INVALIDATION_KEY, "true");
};
