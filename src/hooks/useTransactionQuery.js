import { useQuery } from "@tanstack/react-query";
import { fetchTransactions } from "../api";

export const useTransactionQuery = () => {
    return useQuery({
        queryKey: ["transactions"],
        queryFn: fetchTransactions,
        staleTime: 1000 * 60 * 5,
    });
};
