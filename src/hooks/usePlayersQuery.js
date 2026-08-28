import { useQuery } from "@tanstack/react-query";
import { fetchPlayers } from "../api";
import { mergeLocalData } from "@/admin/localStore";

export const usePlayersQuery = () => {
    return useQuery({
        queryKey: ["players"],
        queryFn: fetchPlayers,
        select: (data) => mergeLocalData("players", data),
        // staleTime: 1000 * 60 * 15,
    });
};