import { Purchase } from "@/lib/purchases/IPurchase";
import { PURCHASE_API } from "../urls";

export const registerPurchase = async (
  purchaseData: Purchase,
  token: string
) => {
  const response = await fetch(PURCHASE_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(purchaseData),
  });

  if (!response.ok) {
    throw new Error("Error al registrar la compra");
  }

  return response.json();
};
