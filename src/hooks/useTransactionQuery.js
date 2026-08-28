import { useQuery } from "@tanstack/react-query";
import { fetchTransactions } from "../api";
import { mergeLocalData } from "@/admin/localStore";

export const useTransactionQuery = (type) => {
    return useQuery({
        queryKey: ["transactions", type ?? null],
        queryFn: () => fetchTransactions(type),
        select: (data) => mergeLocalData("transactions", data),
        staleTime: 1000 * 60 * 5,
    });
};
