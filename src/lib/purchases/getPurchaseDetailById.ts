import { PURCHASE_API } from "@/lib/urls";
import { Purchase } from "@/lib/purchases/IPurchase";


export const getPurchaseById = async (
  purchaseId: string,
  token: string
): Promise<Purchase> => {
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
      const error = await response.json();
      throw new Error(
        error?.message || error?.error || `Error HTTP: ${response.status}`
      );
    }

    const result = await response.json();
    return result as Purchase;
  } catch (error) {
    throw error;
  }
};