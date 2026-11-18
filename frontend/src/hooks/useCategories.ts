import { useQuery } from "@apollo/client";
import { CATEGORIES_QUERY } from "../graphql/queries/categories";

export interface Category {
  id: string;
  name: string;
  description?: string | null;
  color: "GRAY" | "BLUE" | "PURPLE" | "PINK" | "RED" | "ORANGE" | "YELLOW" | "GREEN";
  icon: string;
  transactionsCount: number;
  totalAmount: number;
  createdAt: string;
}

export function useCategories() {
  const { data, loading, error, refetch } = useQuery<{ categories: Category[] }>(CATEGORIES_QUERY);

  return {
    categories: data?.categories ?? [],
    loading,
    error,
    refetch,
  };
}
