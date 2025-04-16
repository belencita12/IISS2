import { INVOICE_API } from "@/lib/urls";
import { Invoice } from "./IInvoice";

export async function getInvoiceById(id: string, token: string): Promise<Invoice> {
  try {
    const response = await fetch(`${INVOICE_API}/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al obtener la factura");
    }

    return await response.json();
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Error al obtener la factura");
  }
}
