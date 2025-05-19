import { RECEIPT_API } from "@/lib/urls";
import { IReceipt } from "./IReceipt";

export async function getReceiptById(id: string, token: string): Promise<IReceipt> {
  try {
    const response = await fetch(`${RECEIPT_API}/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al obtener el recibo");
    }

    return await response.json();
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Error al obtener el recibo");
  }
}