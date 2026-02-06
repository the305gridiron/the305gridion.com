import axios from "axios";

const API_URL = "https://x8ki-letl-twmt.n7.xano.io/api:ivUQhm7H/designation";
const DESIGNATIONS_KEY = "designations";
const DESIGNATIONS_CACHE_INVALIDATION_KEY = "designationsCacheInvalidated";

export const fetchDesignations = async (forceRefresh = false) => {
    const cacheInvalidated =
        localStorage.getItem(DESIGNATIONS_CACHE_INVALIDATION_KEY) === "true";

    if (
        !forceRefresh &&
        !cacheInvalidated &&
        localStorage.getItem(DESIGNATIONS_KEY)
    ) {
        console.log("Returning cached designations");
        return JSON.parse(localStorage.getItem(DESIGNATIONS_KEY));
    }
    try {
        console.log("DESIGNATIONS API Hit");
        const response = await axios.get(API_URL);
        const designations = response.data;
        localStorage.setItem(DESIGNATIONS_KEY, JSON.stringify(designations));
        localStorage.removeItem(DESIGNATIONS_CACHE_INVALIDATION_KEY);
        return designations;
    } catch (error) {
        console.error("Error fetching designations:", error);
        return {};
    }
};

export const invalidateDesignationsCache = () => {
    localStorage.setItem(DESIGNATIONS_CACHE_INVALIDATION_KEY, "true");
};
