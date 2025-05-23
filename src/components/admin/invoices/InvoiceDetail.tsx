"use client";
import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { useInvoiceDetail } from "@/hooks/invoices/useInvoiceDetail";
import InvoiceDetailCard from "@/components/admin/invoices/InvoiceDetailCard";
import InvoiceDetailTable from "@/components/admin/invoices/InvoiceDetailTable";
import { toast } from "@/lib/toast";
import InvoiceDetailSkeleton from "./skeleton/InvoiceDetailSkeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { PrintInvoiceModal } from "@/components/global/PrintInvoiceModal";
import { getInvoiceDetailReport } from "@/lib/invoices/getInvoiceDetailReport";
import { useRouter } from "next/navigation";
import PrintButton from "@/components/global/PrintButton";


interface Props {
  token: string;
}

export default function InvoiceDetail({ token }: Props) {
  const params = useParams<{ id: string }>();
  const invoiceId = params?.id || "";
  const { invoice, invoiceDetails, loading, error } = useInvoiceDetail(
    invoiceId, 
    token
  );
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);


  const i = useTranslations("InvoiceTable");
  const b = useTranslations("Button");

  useEffect(() => {
    if (error && typeof error === "object" && "message" in error) {
      toast("error", (error as Error).message);
    }
  }, [error]);

  const router = useRouter();

const handlePrintInvoice = async () => {
  if (!invoiceId) return; // Asegúrate de tener este id disponible

  setIsPrinting(true);
  try {
    const result = await getInvoiceDetailReport(invoiceId, token); // token debe estar disponible

    if ("message" in result) {
      toast("error", result.message);
      return;
    }

    const blobUrl = URL.createObjectURL(result);
    const printWindow = window.open(blobUrl, "_blank");

    if (printWindow) {
      printWindow.addEventListener("load", () => {
        printWindow.focus();
        printWindow.print();
        printWindow.addEventListener("afterprint", () => {
          URL.revokeObjectURL(blobUrl);
        });
      });
    } else {
      toast("error", "No se pudo abrir la ventana de impresión.");
    }

    setShowPrintModal(false);
  } catch {
    toast("error", "Error al imprimir la factura");
  } finally {
    setIsPrinting(false);
  }
};


  if (loading) return <InvoiceDetailSkeleton/>;

  return (
      <div className="w-full px-0">
<div className="flex justify-between items-center mb-4 mt-4">
  <Link href="/dashboard/invoices">
    <Button variant="outline" className="border-black border-solid">
      {b("toReturn")}
    </Button>
  </Link>

  <div className="flex-grow-0">
    <PrintButton onClick={handlePrintInvoice} isLoading={isPrinting} />
  </div>
</div>

        {invoice && <InvoiceDetailCard invoice={invoice} />}
        
        <h3 className="text-xl font-semibold text-black mb-3 mt-3">
          {i("invoiceDetail")}
        </h3>

        <div className="w-full">
          <InvoiceDetailTable details={invoiceDetails} />
        </div>
      </div>
  );
}