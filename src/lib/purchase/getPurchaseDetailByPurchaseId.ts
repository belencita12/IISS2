import { PURCHASE_DETAIL_API } from "@/lib/urls";
import { PurchaseDetailResponse } from "@/lib/purchase/IPurchaseDetail";

//detalles de la compra que tengan el mismo id de compra
export const getPurchaseDetailByPurchaseId = async (
  purchaseId: string,
  page: number = 1,  
  token: string
): Promise<PurchaseDetailResponse> => {
  try {
    const response = await fetch(
      `${PURCHASE_DETAIL_API}?purchaseId=${purchaseId}&page=${page}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      if (errorText.toLowerCase().includes("no encontrado")) {
        throw new Error("La compra no existe");
      }
      throw new Error("Ocurrió un error. Intenta nuevamente.");
    }

    return await response.json() as PurchaseDetailResponse; 
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Ocurrió un error. Intenta nuevamente.");
  }
};
