import { useState, useEffect, useCallback } from "react";
import { getPurchases } from "@/lib/purchase/getPurchases";
import { GetPurchaseQueryParams, PurchaseData } from "@/lib/purchase/IPurchase";
import { PaginationResponse } from "@/lib/types";
import { useQuery } from "../useQuery";

interface UsePurchaseListProps {
  token: string;
  init?: GetPurchaseQueryParams;
}

export const useGetPurchases = ({ token, init }: UsePurchaseListProps) => {
  const [data, setData] = useState<PaginationResponse<PurchaseData> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { query, setQuery, toQueryString } = useQuery(init);

  const fetchPurchases = useCallback(async () => {
    setLoading(true);
    try {
      const queryStr = toQueryString();
      const result = await getPurchases(token, queryStr);
      setData(result);
    } catch (err) {
      console.error(err);
      setError("Error al obtener compras");
    } finally {
      setLoading(false);
    }
  }, [token, toQueryString]);

  useEffect(() => {
    fetchPurchases();
  }, [fetchPurchases]);

  return {
    data,
    isLoading: loading,
    error,
    query,
    setQuery,
    handleSearch: fetchPurchases,
  };
};
