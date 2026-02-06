import axios from "axios";

const API_URL = "https://x8ki-letl-twmt.n7.xano.io/api:ivUQhm7H/prospect";
const PROSPECTS_KEY = "prospects";
const CACHE_INVALIDATION_KEY = "prospectsCacheInvalidated";

const positionOrder = [
    "QB",
    "RB",
    "WR",
    "TE",
    "T",
    "G",
    "C",
    "EDGE",
    "IDL",
    "LB",
    "CB",
    "S",
];

export const fetchProspects = async (forceRefresh = false) => {
    // Check if invalidated
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
        const sortedProspects = response.data.sort((a, b) => {
            const positionIndexA = positionOrder.indexOf(a.position);
            const positionIndexB = positionOrder.indexOf(b.position);
            if (positionIndexA < positionIndexB) return -1;
            if (positionIndexA > positionIndexB) return 1;
            return a.position_rank - b.position_rank;
        });
        const prospectsByPosition = sortedProspects.reduce((acc, prospect) => {
            if (!acc[prospect.position]) {
                acc[prospect.position] = [];
            }
            acc[prospect.position].push(prospect);
            return acc;
        }, {});
        localStorage.setItem(
            PROSPECTS_KEY,
            JSON.stringify(prospectsByPosition)
        );
        localStorage.removeItem(CACHE_INVALIDATION_KEY);
        return prospectsByPosition;
    } catch (error) {
        console.error("Error fetching prospects:", error);
        return {};
    }
};

export const invalidateProspectsCache = () => {
    localStorage.setItem(CACHE_INVALIDATION_KEY, "true");
};
