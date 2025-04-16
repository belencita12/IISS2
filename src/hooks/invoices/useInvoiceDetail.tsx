import { useEffect, useState } from "react";
import { Invoice, InvoiceDetail } from "@/lib/invoices/IInvoice";
import { getInvoiceById } from "@/lib/invoices/getInvoiceById";
import { getInvoiceDetail } from "@/lib/invoices/getInvoiceDetail";

export function useInvoiceDetail(invoiceId: string, token: string) {
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [invoiceDetails, setInvoiceDetails] = useState<InvoiceDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        if (!invoiceId) throw new Error("ID de factura inválido");
        const invoiceData = await getInvoiceById(invoiceId, token);
        setInvoice(invoiceData);

        const detailsResponse = await getInvoiceDetail(invoiceData.invoiceNumber, token);
        setInvoiceDetails(detailsResponse.data);
        setTotalItems(detailsResponse.total);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Error desconocido";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [invoiceId, token]);

  return { invoice, invoiceDetails, loading, error, totalItems };
}
