import { RECEIPT_API } from "@/lib/urls";
import { IReceipt } from "./IReceipt";

export async function getReceiptByInvoiceNumber(invoiceNumber: string, token: string): Promise<IReceipt> {
  try {
    const params = new URLSearchParams({
      searchTerm: invoiceNumber,
      page: "1",
      size: "1",
    });

    const response = await fetch(`${RECEIPT_API}?${params.toString()}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al buscar el recibo");
    }

    const data = await response.json();

    const receipt = data?.data?.[0];
    if (!receipt) {
      throw new Error("No se encontró un recibo asociado a la factura.");
    }

    return receipt as IReceipt;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Error al buscar el recibo");
  }
}
