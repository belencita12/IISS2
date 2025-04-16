"use client";
import React from "react";
import { useParams } from "next/navigation";
import { useInvoiceDetail } from "@/hooks/invoices/useInvoiceDetail";
import InvoiceDetailCard from "@/components/admin/invoices/InvoiceDetailCard";
import InvoiceDetailProduct from "@/components/admin/invoices/InvoiceDetailProduct";

interface Props {
  token: string;
}

export default function InvoiceDetail({ token }: Props) {
  const params = useParams<{ id: string }>();
  const invoiceId = params?.id;
  const { invoice, invoiceDetails, loading, error, totalItems } = useInvoiceDetail(invoiceId, token);

  if (loading) {
    return (
      <div className="p-4 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-lg">Cargando factura...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
          <button onClick={() => window.location.reload()} className="absolute top-0 bottom-0 right-0 px-4 py-3">
            <svg className="fill-current h-6 w-6 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M14.66 15.66A8 8 0 1 1 17 10h-2a6 6 0 1 0-1.76 4.24l1.42 1.42zM12 10h8l-4 4-4-4z" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="p-4">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <p>No se encontró la factura solicitada.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-0">
  <InvoiceDetailCard invoice={invoice} />

  <h3 className="text-xl font-semibold text-black mb-3 mt-3">Detalles</h3>

  <div className="w-full">
  <InvoiceDetailProduct
  details={invoiceDetails}
  totalItems={totalItems}
  totalAmount={invoice.total}
  totalPayed={invoice.totalPayed}
  totalVat={invoice.totalVat}
/>


  </div>
</div>

  );  
}
