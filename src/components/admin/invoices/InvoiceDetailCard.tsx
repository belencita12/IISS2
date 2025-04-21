import React from "react";
import { Invoice, InvoicePaymentMethod } from "@/lib/invoices/IInvoice";
import { formatDate } from "@/lib/utils";

interface Props {
  invoice: Invoice;
  paymentMethod?: InvoicePaymentMethod | null;
}

export default function InvoiceDetailCard({ invoice, paymentMethod }: Props) {
  return (
    <div className="bg-white border border-gray-300 rounded-lg p-4 w-full mt-6">
      <div className="grid grid-cols-2 grid-rows-7 gap-x-3 gap-y-2">
        <p className="col-start-1 row-start-1 text-2xl font-semibold">
          Factura Nº {invoice.invoiceNumber}
        </p>
        <p className="col-start-2 row-start-1 text-right text-gray-500 text-m mt-2">
          {formatDate(invoice.issueDate)}
        </p>
        <p className="col-start-1 row-start-2 font-semibold">
          Timbrado: {invoice.stamped}
        </p>
        <p className="col-start-1 row-start-3">Cliente: {invoice.clientName}</p>
        <p className="col-start-2 row-start-3 text-right">
          <span className="bg-gray-200 px-3 py-1 rounded inline-block">
            RUC: {invoice.ruc}
          </span>
        </p>
        <p className="col-start-1 row-start-4">Monto Total</p>
        <p className="col-start-2 row-start-4 text-right">
          <span className="bg-gray-200 px-3 py-1 rounded inline-block">
            {new Intl.NumberFormat("es-PY").format(invoice.total)} Gs.
          </span>
        </p>
        <p className="col-start-1 row-start-5">IVA</p>
        <p className="col-start-2 row-start-5 text-right">
          <span className="bg-gray-200 px-3 py-1 rounded inline-block">
            {new Intl.NumberFormat("es-PY").format(invoice.totalVat)} Gs.
          </span>
        </p>
        <p className="col-start-1 row-start-6">Condición de venta</p>
        <p className="col-start-2 row-start-6 text-right">
          {invoice.type === "CREDIT"
            ? "Crédito"
            : invoice.type === "CASH"
            ? "Contado"
            : "Desconocido"}
        </p>
        <p className="col-start-1 row-start-7">Método de pago</p>
        <p className="col-start-2 row-start-7 text-right">
          {paymentMethod ? paymentMethod.method : "N/A"}
        </p>
      </div>
    </div>
  );
}
