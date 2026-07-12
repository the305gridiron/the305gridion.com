import axios from "axios";

const API_URL = "/.netlify/functions/youtube";

export const fetchYoutubeVideos = async (forceRefresh = false) => {
    try {
        const response = await axios.get(`${API_URL}${forceRefresh ? "?force=true" : ""}`);
        if (response.data && typeof response.data === "object" && !Array.isArray(response.data)) {
            return response.data;
        }
        return { videos: [], liveStream: null };
    } catch (error) {
        console.error("Error fetching youtube videos:", error);
        return { videos: [], liveStream: null };
    }
};

