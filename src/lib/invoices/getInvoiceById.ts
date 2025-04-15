// /lib/invoices/invoiceService.ts
import { INVOICE_API } from "@/lib/urls";
import { Invoice } from "./IInvoice";

export async function getInvoiceById(id: string, token: string): Promise<Invoice> {
  // Aquí está el cambio: quitar el segmento "invoice/" si ya está incluido en INVOICE_API
  const response = await fetch(`${INVOICE_API}/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Error al obtener la factura");
  }

  return response.json();
}