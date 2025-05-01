"use client";
import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { useInvoiceDetail } from "@/hooks/invoices/useInvoiceDetail";
import InvoiceDetailCard from "@/components/admin/invoices/InvoiceDetailCard";
import InvoiceDetailTable from "@/components/admin/invoices/InvoiceDetailTable";
import { toast } from "@/lib/toast";

interface Props {
  token: string;
}

export default function InvoiceDetail({ token }: Props) {
  const params = useParams<{ id: string }>();
  const invoiceId = params?.id || '';
  const { invoice, invoiceDetails, loading, error } = useInvoiceDetail(
    invoiceId, 
    token
  );

  useEffect(() => {
    if (error) {
      toast("error", error || "Ocurrió un error al cargar la factura");
    }
  }, [error]);

  if (loading) return <p className="text-center">Cargando detalles de la factura...</p>;

  return (
    <div className="w-full px-0">
      {invoice && <InvoiceDetailCard invoice={invoice} />}
      <h3 className="text-xl font-semibold text-black mb-3 mt-3">Detalle</h3>
      <div className="w-full">
        <InvoiceDetailTable details={invoiceDetails} />
      </div>
    </div>
  );
}
