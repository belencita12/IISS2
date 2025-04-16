import { INVOICE_DETAIL_API } from "@/lib/urls";
import {
  InvoiceDetail,
} from "./IInvoice";
export async function getInvoiceDetailsById(
  invoiceId: string,
  token: string
): Promise<InvoiceDetail[]> {
  const response = await fetch(`${INVOICE_DETAIL_API}/invoice-detail/${invoiceId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Error al obtener detalles de la factura");
  }

  const data = await response.json();
  return Array.isArray(data) ? data : [data];
}