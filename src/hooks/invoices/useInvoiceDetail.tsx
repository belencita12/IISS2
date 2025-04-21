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

        // Obtiene la factura
        const invoiceData = await getInvoiceById(invoiceId, token);
        setInvoice(invoiceData);

        // Obtiene los detalles filtrados por invoiceNumber
        const detailsResponse = await getInvoiceDetail(
          invoiceData.invoiceNumber,
          token
        );
        const fetchedDetails = detailsResponse.data;

        // Lógica para agrupar detalles por producto
        // Si un mismo producto se repite en la factura, se suman sus cantidades y montos.
        const groupedDetails = Object.values(
          fetchedDetails.reduce(
            (acc: Record<string, InvoiceDetail>, detail) => {
              const key = detail.product.id.toString();
              if (!acc[key]) {
                acc[key] = { ...detail };
              } else {
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
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error desconocido";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [invoiceId, token]);

  return { invoice, invoiceDetails, loading, error, totalItems };
}