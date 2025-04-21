import { useEffect, useState } from "react";
import {
  Invoice,
  InvoiceDetail,
  InvoicePaymentMethod,
} from "@/lib/invoices/IInvoice";
import { getInvoiceById } from "@/lib/invoices/getInvoiceById";
import { getInvoiceDetail } from "@/lib/invoices/getInvoiceDetail";
import { getInvoicePaymentMethod } from "@/lib/invoices/getInvoicePaymentMethod";

export function useInvoiceDetail(invoiceId: string, token: string) {
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [invoiceDetails, setInvoiceDetails] = useState<InvoiceDetail[]>([]);
  const [paymentMethod, setPaymentMethod] =
    useState<InvoicePaymentMethod | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");

      try {
        if (!invoiceId) throw new Error("ID de factura inválido");

        // 1. Obtener factura
        const invoiceData = await getInvoiceById(invoiceId, token);
        setInvoice(invoiceData);

        // 2. Obtener detalles de la factura
        const detailsResponse = await getInvoiceDetail(
          invoiceData.invoiceNumber,
          token
        );
        const groupedDetails = Object.values(
          detailsResponse.data.reduce(
            (acc: Record<string, InvoiceDetail>, detail) => {
              const key = detail.product.id.toString();
              if (!acc[key]) acc[key] = { ...detail };
              else {
                acc[key].quantity += detail.quantity;
                acc[key].partialAmount += detail.partialAmount;
                acc[key].partialAmountVAT += detail.partialAmountVAT;
              }
              return acc;
            },
            {} as Record<string, InvoiceDetail>
          )
        );
        setInvoiceDetails(groupedDetails);
        setTotalItems(detailsResponse.total);

        // 3. Obtener métodos de pago y tomar el primero
        const payments = await getInvoicePaymentMethod(
          invoiceData.id,
          token,
          1,
          1
        );
        console.log("[useInvoiceDetail] payments:", payments);
        setPaymentMethod(payments[0] ?? null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [invoiceId, token]);

  return { invoice, invoiceDetails, paymentMethod, loading, error, totalItems };
}
