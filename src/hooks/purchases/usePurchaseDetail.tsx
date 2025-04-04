import { useEffect, useState } from "react";
import { getPurchaseDetailByPurchaseId } from "@/lib/purchases/getPurchaseDetailByPurchaseId";
import { PurchaseDetail } from "@/lib/purchases/IPurchaseDetail";

export const usePurchaseDetail = (id: string, token: string, page: number = 1) => {
  const [data, setData] = useState<PurchaseDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getPurchaseDetailByPurchaseId(id, page, token);
        console.log("Resultado de la API: ", result);
        setData(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
        console.error("Error al obtener detalles de compra: ", err);
      } finally {
        setLoading(false);
      }
    };
  
    if (id) fetchData();
  }, [id, token, page]);
  
  return { data, loading, error };
};
