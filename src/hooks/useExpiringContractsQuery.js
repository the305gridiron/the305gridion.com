import { useQuery } from "@tanstack/react-query";
import { fetchExpiringContracts } from "../api";

export const useExpiringContractsQuery = () => {
    return useQuery({
        queryKey: ["expiringContracts"],
        queryFn: fetchExpiringContracts,
        staleTime: 1000 * 60 * 5,
    });
};
