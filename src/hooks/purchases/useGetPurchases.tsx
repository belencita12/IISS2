import { useState, useEffect, useCallback } from "react";
import { getPurchases } from "@/lib/purchase/getPurchases";
import { GetPurchaseQueryParams, PurchaseData } from "@/lib/purchases/IPurchase";
import { PaginationResponse } from "@/lib/types";
import { useQuery } from "../useQuery";
import { toast } from "@/lib/toast";

interface UsePurchaseListProps {
  token: string;
  init?: GetPurchaseQueryParams;
}

export const useGetPurchases = ({ token, init }: UsePurchaseListProps) => {
  const [data, setData] = useState<PaginationResponse<PurchaseData> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error] = useState<string | null>(null);
  const { query, setQuery, toQueryString } = useQuery(init);

  const fetchPurchases = useCallback(async () => {
    setLoading(true);
    try {
      const queryStr = toQueryString();
      const result = await getPurchases(token, queryStr);
      setData(result);
    } catch (err:unknown) {
      if (typeof error === "object" && error !== null && "message" in error) {
        const errorMessage = (error as { message: string }).message;
        toast("error", errorMessage);
        return;
      }
      toast("error", "Error inesperado al obtener las compras");
    } finally {
      setLoading(false);
    }
  }, [token, toQueryString, error]);

  useEffect(() => {
    fetchPurchases();
  }, [fetchPurchases, token]);

  return {
    data,
    isLoading: loading,
    error,
    query,
    setQuery,
    handleSearch: fetchPurchases,
  };
};
