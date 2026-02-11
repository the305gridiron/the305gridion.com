import axios from "axios";

const API_URL = "https://x8ki-letl-twmt.n7.xano.io/api:ivUQhm7H/prospect";
const PROSPECTS_KEY = "prospects";
const CACHE_INVALIDATION_KEY = "prospectsCacheInvalidated";

const positionOrder = [
    "QB",
    "RB",
    "WR",
    "TE",
    "OT",
    "IOL",
    "EDGE",
    "DL",
    "LB",
    "CB",
    "S",
];

export const fetchProspects = async (forceRefresh = false) => {
    const cacheInvalidated =
        localStorage.getItem(CACHE_INVALIDATION_KEY) === "true";

    if (
        !forceRefresh &&
        !cacheInvalidated &&
        localStorage.getItem(PROSPECTS_KEY)
    ) {
        console.log("Returning cached prospects");
        return JSON.parse(localStorage.getItem(PROSPECTS_KEY));
    }

    try {
        console.log("PROSPECTS API Hit");
        const response = await axios.get(API_URL);

        const sortedProspects = response.data
            .filter((p) => p.draftYear === 2026)
            .sort((a, b) => a.draft_rank - b.draft_rank);

        localStorage.setItem(
            PROSPECTS_KEY,
            JSON.stringify(sortedProspects)
        );

        localStorage.removeItem(CACHE_INVALIDATION_KEY);
        return sortedProspects;
    } catch (error) {
        console.error("Error fetching prospects:", error);
        return [];
    }
};

export const invalidateProspectsCache = () => {
    localStorage.setItem(CACHE_INVALIDATION_KEY, "true");
};
