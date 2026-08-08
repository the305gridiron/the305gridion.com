import { useQuery } from "@tanstack/react-query";
import { fetchTeams } from "../api";

export const useTeamsQuery = () => {
    return useQuery({
        queryKey: ["teams"],
        queryFn: fetchTeams,
        staleTime: 1000 * 60 * 60,
    });
};