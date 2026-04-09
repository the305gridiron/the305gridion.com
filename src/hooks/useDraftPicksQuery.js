import { useQuery } from "@tanstack/react-query";
import { fetchDraftPicks } from "../api";

export const useDraftPicksQuery = (year) => {
    return useQuery({
        queryKey: ["draftPicks", year ?? null],
        queryFn: () => fetchDraftPicks(year),
        staleTime: 1000 * 60 * 5,
    });
};
