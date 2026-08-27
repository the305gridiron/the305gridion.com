import { useQuery } from "@tanstack/react-query";
import { fetchPlayers } from "../api";

export const usePlayersQuery = () => {
    return useQuery({
        queryKey: ["players"],
        queryFn: fetchPlayers,
        // staleTime: 1000 * 60 * 15,
    });
};