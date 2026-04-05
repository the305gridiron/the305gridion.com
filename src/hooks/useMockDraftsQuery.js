import { useQuery } from "@tanstack/react-query";
import { fetchMockDrafts } from "../api";

export const useMockDraftsQuery = () => {
    return useQuery({
        queryKey: ["mockDrafts"],
        queryFn: fetchMockDrafts,
    });
};