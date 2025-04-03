import { useEffect, useState } from "react";
import { getPurchaseDetailById } from "@/lib/purchase/getPurchaseDetailById";
import { PurchaseDetail } from "@/lib/purchase/IPurchaseDetail";

export const usePurchaseDetail = (id: string, token: string) => {
  const [data, setData] = useState<PurchaseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getPurchaseDetailById(id, token);
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, token]);
  
  return { data, loading, error };
};