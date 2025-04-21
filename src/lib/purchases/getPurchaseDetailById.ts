import { PURCHASE_API } from "@/lib/urls";
import { PurchaseData } from "@/lib/purchases/IPurchase";

export const getPurchaseById = async (
  purchaseId: string,
  token: string
): Promise<PurchaseData> => {
  try {
    const response = await fetch(
      `${PURCHASE_API}/${purchaseId}`,
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
        throw new Error("La compra no tiene detalles");
      }
      throw new Error("Ocurrió un error. Intenta nuevamente.");
    }

    return await response.json() as PurchaseData;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Ocurrió un error. Intenta nuevamente.");
  }
};
