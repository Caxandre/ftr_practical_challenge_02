import { useQuery } from "@apollo/client";
import { TRANSACTIONS_QUERY } from "../graphql/queries/transactions";
import type { Category } from "./useCategories";

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  date: string;
  createdAt: string;
  category: Category;
}

interface TransactionsData {
  transactions: {
    items: Transaction[];
    total: number;
    page: number;
    perPage: number;
  };
}

export function useTransactions(page: number, perPage = 10) {
  const { data, loading, error, refetch } = useQuery<TransactionsData>(TRANSACTIONS_QUERY, {
    variables: { page, perPage },
    fetchPolicy: "cache-and-network",
  });

  return {
    transactions: data?.transactions.items ?? [],
    total: data?.transactions.total ?? 0,
    page: data?.transactions.page ?? page,
    perPage: data?.transactions.perPage ?? perPage,
    loading,
    error,
    refetch,
  };
}
