import { INVOICE_DETAIL_API } from "@/lib/urls";
import { InvoiceDetailResponse } from "./IInvoice";

export async function getInvoiceDetail(
  invoiceNumber: string, 
  token: string
): Promise<InvoiceDetailResponse> {
  try {
    const url = new URL(`${INVOICE_DETAIL_API}`);
    url.searchParams.append("page", "1");
    url.searchParams.append("size", "50");
    url.searchParams.append("invoiceNumber", invoiceNumber);

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al obtener detalles de la factura");
    }

    return await response.json();
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Error al obtener detalles de la factura");
  }
}
