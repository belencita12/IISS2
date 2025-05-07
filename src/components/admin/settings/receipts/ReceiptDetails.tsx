"use client";

import { useEffect, useState } from "react";
import { IReceipt } from "@/lib/receipts/IReceipt";
import { Invoice } from "@/lib/invoices/IInvoice";
import { getReceiptById } from "@/lib/receipts/getReceiptById";
import { getInvoiceById } from "@/lib/invoices/getInvoiceById";
import { Button } from "@/components/ui/button";


interface ReceiptDetailProps {
  id: string;
  token: string;
}

export default function ReceiptDetail({ id, token }: ReceiptDetailProps) {
  const [receipt, setReceipt] = useState<IReceipt | null>(null);
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const receiptData = await getReceiptById(id, token);
        setReceipt(receiptData);
        
        const invoiceData = await getInvoiceById(receiptData.invoiceId.toString(), token);
        setInvoice(invoiceData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar los datos");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id, token]);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!receipt || !invoice) return <div>No se encontraron datos</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Detalle del Recibo</h1>
      
      <div className="bg-white shadow rounded-lg p-6 space-y-6">
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Información del Recibo</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Número de recibo</p>
              <p className="font-medium">{receipt.receiptNumber}</p>
            </div>
            <div>
              <p className="text-gray-600">Total</p>
              <p className="font-medium">
                {receipt.total.toLocaleString("es-PY", {
                  style: "currency",
                  currency: "PYG",
                })}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Fecha de emisión</p>
              <p className="font-medium">
                {(() => {
                    const [year, month, day] = receipt.issueDate.split("-");
                    return new Date(Number(year), Number(month) - 1, Number(day)).toLocaleDateString();
                })()}
              </p>
            </div>
          </div>
        </section>

        {/* Métodos de Pago */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Métodos de Pago</h2>
          <div className="space-y-2">
            {receipt.paymentMethods.map((pm, index) => (
              <div key={index} className="flex justify-between items-center">
                <span>{pm.method}</span>
                <span className="font-medium">
                  {pm.amount.toLocaleString("es-PY", {
                    style: "currency",
                    currency: "PYG",
                  })}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Datos de la Factura */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Datos de la Factura</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Número de factura</p>
              <p className="font-medium">{invoice.invoiceNumber}</p>
            </div>
            <div>
              <p className="text-gray-600">RUC</p>
              <p className="font-medium">{invoice.ruc}</p>
            </div>
            <div>
              <p className="text-gray-600">Cliente</p>
              <p className="font-medium">{invoice.clientName}</p>
            </div>
            <div>
              <p className="text-gray-600">Tipo</p>
              <p className="font-medium">
                {invoice.type === "CASH" ? "Contado"
                : invoice.type === "CREDIT" ? "Crédito"
                : invoice.type}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Total</p>
              <p className="font-medium">
                {invoice.total.toLocaleString("es-PY", {
                  style: "currency",
                  currency: "PYG",
                })}
              </p>
            </div>
            <div>
              <p className="text-gray-600">IVA Total</p>
              <p className="font-medium">
                {invoice.totalVat.toLocaleString("es-PY", {
                  style: "currency",
                  currency: "PYG",
                })}
              </p>
            </div>
            <div className="mt-6 flex justify-end">
                <Button variant="secondary"
                  onClick={() => window.location.href = "/dashboard/settings/receipts"}>
                    Volver
                </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}