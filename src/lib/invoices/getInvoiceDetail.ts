// lib/invoices/getInvoiceDetail.ts
import { INVOICE_DETAIL_API } from "@/lib/urls";
import { InvoiceDetailResponse } from "./IInvoice";

export async function getInvoiceDetail(
  invoiceNumber: string, 
  token: string
): Promise<InvoiceDetailResponse> {
  // Corregimos la URL - asumiendo que INVOICE_DETAIL_API ya incluye /invoice-detail
  const url = new URL(`${INVOICE_DETAIL_API}`);
  url.searchParams.append('page', '1');
  url.searchParams.append('invoiceNumber', invoiceNumber);

  console.log("URL para detalles:", url.toString()); // Para depuración

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Error respuesta API:", errorData); // Para depuración
    throw new Error(errorData.message || "Error al obtener detalles de la factura");
  }

  return response.json();
}