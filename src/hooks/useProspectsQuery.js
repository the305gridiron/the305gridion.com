import { useQuery } from "@tanstack/react-query";
import { fetchProspects } from "../api";

export const useProspectsQuery = (year) => {
    return useQuery({
        queryKey: ["prospects", year ?? null],
        queryFn: () => fetchProspects(year),
        staleTime: 1000 * 60 * 5,
    });
};
