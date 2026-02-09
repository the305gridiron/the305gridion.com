import axios from "axios";

const API_URL = "/.netlify/functions/youtube";

export const fetchYoutubeVideos = async (forceRefresh = false) => {
    try {
        console.log("Fetching YouTube videos", forceRefresh ? "(forced)" : "");
        const response = await axios.get(`${API_URL}${forceRefresh ? "?force=true" : ""}`);
        return response.data || [];
    } catch (error) {
        console.error("Error fetching youtube videos:", error);
        return [];
    }
};

