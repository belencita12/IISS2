import React from "react";
import { Invoice } from "@/lib/invoices/IInvoice";

interface Props {
  invoice: Invoice;
}

export default function InvoiceDetailCard({ invoice }: Props) {
  return (
    <div className="bg-white border border-gray-300 rounded-lg p-4 w-full mt-6">
      <div className="grid grid-cols-2 grid-rows-5 gap-x-3 gap-y-2">
        {/* Fila 1 */}
        <p className="col-start-1 row-start-1">Timbrado: {invoice.stamped}</p>
        <p className="col-start-2 row-start-1 text-right text-gray-500">
          {invoice.issueDate.slice(0, 10)}
        </p>

        {/* Fila 2 */}
        <p className="col-start-1 row-start-2">{invoice.clientName}</p>
        <p className="col-start-2 row-start-2 text-right">
          <span className="bg-gray-200 px-3 py-1 rounded inline-block">
            RUC: {invoice.ruc}
          </span>
        </p>

        {/* Fila 3 */}
        <p className="col-start-1 row-start-3">Monto Total</p>
        <p className="col-start-2 row-start-3 text-right">
          <span className="bg-gray-200 px-3 py-1 rounded inline-block">
            {new Intl.NumberFormat("es-PY").format(invoice.total)} Gs.
          </span>
        </p>

        {/* Fila 4 */}
        <p className="col-start-1 row-start-4">IVA</p>
        <p className="col-start-2 row-start-4 text-right">
          <span className="bg-gray-200 px-3 py-1 rounded inline-block">
            {new Intl.NumberFormat("es-PY").format(invoice.totalVat)} Gs.
          </span>
        </p>

        {/* Fila 5 */}
        <p className="col-start-1 row-start-5">Método de pago</p>
        <p className="col-start-2 row-start-5 text-right">
          {invoice.type === "CREDIT" ? "Crédito" : "Efectivo"}
        </p>
      </div>
    </div>
  );
}
