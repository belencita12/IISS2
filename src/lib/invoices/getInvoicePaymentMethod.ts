import { INVOICE_PAYMENT_METHOD_API } from "@/lib/urls";
import { InvoicePaymentMethod, InvoicePaymentMethodResponse } from "./IInvoice";

export async function getInvoicePaymentMethod(
  invoiceId: number,
  token: string,
  page: number = 1,
  size: number = 1
): Promise<InvoicePaymentMethod[]> {
  const params = new URLSearchParams({
    invoiceId: invoiceId.toString(),
    page: page.toString(),
    size: size.toString(),
  });
  const url = `${INVOICE_PAYMENT_METHOD_API}?${params.toString()}`;
  const response = await fetch(url, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error al obtener métodos de pago");
  }

  const json: InvoicePaymentMethodResponse = await response.json();
  return json.data;
}
