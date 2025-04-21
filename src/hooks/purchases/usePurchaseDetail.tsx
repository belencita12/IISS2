import { useEffect, useState } from "react";
import { getPurchaseDetailByPurchaseId } from "@/lib/purchases/getPurchaseDetailByPurchaseId";
import { PurchaseDetail, PurchaseDetailResponse } from "@/lib/purchases/IPurchaseDetail";

/*Hook para obtener los detalles de una compra*/
export const usePurchaseDetail = (id: string, token: string, page: number = 1) => {
  const [data, setData] = useState<PurchaseDetail[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        // Realiza la llamada a la API para obtener los detalles de la compra.
        const result: PurchaseDetailResponse = await getPurchaseDetailByPurchaseId(id, page, token);
        setData(result.data);
        setTotalPages(result.totalPages);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Ocurrió un error. Intenta nuevamente.";
        setError(errorMessage);
        console.error("Error al obtener detalles de compra: ", errorMessage);
      } finally {
        setLoading(false);
      }
    };
  
    if (id) fetchData();
  }, [id, token, page]);
  
  return { data, totalPages, loading, error };
};
