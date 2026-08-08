import { useQuery } from "@tanstack/react-query";
import { fetchSchedule } from "../api";

export const useScheduleQuery = () => {
    return useQuery({
        queryKey: ["schedule"],
        queryFn: fetchSchedule,
        staleTime: 1000 * 60 * 60,
    });
};