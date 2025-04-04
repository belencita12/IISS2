import { PURCHASE_DETAIL_API } from "@/lib/urls";
import { PurchaseDetailResponse } from "@/lib/purchases/IPurchaseDetail";

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
      const error = await response.json();
      throw new Error(
        error?.message || error?.error || `Error HTTP: ${response.status}`
      );
    }

    const result = await response.json();
    return result as PurchaseDetailResponse; 
  } catch (error) {
    throw error;
  }
};
