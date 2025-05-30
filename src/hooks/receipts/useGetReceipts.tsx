import { useState, useEffect, useCallback } from "react";
import { getReceipts } from "@/lib/receipts/getReceipts";
import { IReceiptResponse, ReceiptFiltersParams } from "@/lib/receipts/IReceipt";
import { useQuery } from "../useQuery";
import { toast } from "@/lib/toast";

interface UseReceiptListProps {
  token: string;
  init?: ReceiptFiltersParams;
}

export const useGetReceipts = ({ token, init }: UseReceiptListProps) => {
  const [data, setData] = useState<IReceiptResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error] = useState<string | null>(null);
  const { query, setQuery, toQueryString } = useQuery(init);

  const fetchReceipts = useCallback(async () => {
    setLoading(true);
    try {
      const queryStr = toQueryString();
      const result = await getReceipts(token, queryStr);
      setData(result);
    } catch (err: unknown) {
      if (typeof err === "object" && err !== null && "message" in err) {
        toast("error", (err as { message: string }).message);
        return;
      }
      toast("error", "Error inesperado al obtener los recibos");
    } finally {
      setLoading(false);
    }
  }, [token, toQueryString]);

  useEffect(() => {
    fetchReceipts();
  }, [fetchReceipts, token]);

  return {
    data,
    isLoading: loading,
    error,
    query,
    setQuery,
    handleSearch: fetchReceipts,
  };
};
