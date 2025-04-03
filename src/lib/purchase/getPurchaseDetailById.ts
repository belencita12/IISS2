import { PURCHASE_DETAIL_API } from "@/lib/urls";
import { PurchaseDetail } from "@/lib/purchase/IPurchaseDetail";

export const getPurchaseDetailById = async (
  id: string,
  token: string
): Promise<PurchaseDetail> => {
  const response = await fetch(`${PURCHASE_DETAIL_API}/${id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  
  if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
  return await response.json();
};