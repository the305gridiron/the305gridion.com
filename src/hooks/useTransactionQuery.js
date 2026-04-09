import { useQuery } from "@tanstack/react-query";
import { fetchTransactions } from "../api";

export const useTransactionQuery = (type) => {
    return useQuery({
        queryKey: ["transactions", type ?? null],
        queryFn: () => fetchTransactions(type),
        staleTime: 1000 * 60 * 5,
    });
};
