"use client";

import { useEffect, useState } from "react";
import { IReceipt } from "@/lib/receipts/IReceipt";
import { Invoice } from "@/lib/invoices/IInvoice";
import { getReceiptById } from "@/lib/receipts/getReceiptById";
import { getInvoiceById } from "@/lib/invoices/getInvoiceById";
import { Button } from "@/components/ui/button";
import { toast } from "@/lib/toast";
import { getReceiptDetailPdf } from "@/lib/receipts/getReceiptDetailPdf";
import PrintButton from "@/components/global/PrintButton";
import ReceiptDetailSkeleton from "./skeleton/ReceiptDetailSkeleton";
import { useTranslations } from "next-intl";

interface ReceiptDetailProps {
  id: string;
  token: string;
}

export default function ReceiptDetail({ id, token }: ReceiptDetailProps) {
  const t = useTranslations();
  const [receipt, setReceipt] = useState<IReceipt | null>(null);
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const [hasNavigatedBack, setHasNavigatedBack] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const receiptData = await getReceiptById(id, token);
        setReceipt(receiptData);

        const invoiceData = await getInvoiceById(
          receiptData.invoiceId.toString(),
          token
        );
        setInvoice(invoiceData);
      } catch (err: unknown) {
        if (err instanceof Error) 
        setError(
          err.message
        );
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id, token]);

  if (loading) return <ReceiptDetailSkeleton />;
  if (error) return <div>{t("error.error")} {error}</div>;
  if (!receipt || !invoice) return <div>{t("error.notFound")}</div>;

  const handlePrintReceipt = async () => {
    if (!receipt) return;
    setIsPrinting(true);

    try {
      const result = await getReceiptDetailPdf(receipt.id.toString(), token);

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
            setIsPrinting(false);
          });
          setTimeout(() => {
            setIsPrinting(false);
          }, 3000);
        });
      } else {
        toast("error", t("error.noPrint"));
        setIsPrinting(false);
      }
    } catch {
      toast("error", t("error.errorPrintReceipt"));
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between mt-6 mx-4">
        <Button
          variant="outline"
          onClick={() => {
            setHasNavigatedBack(true);
            window.location.href = "/dashboard/settings/receipts";
          }}
          disabled={isPrinting}
        >
          {t("button.toReturn")}
        </Button>
        <div
          className={hasNavigatedBack ? "pointer-events-none opacity-50" : ""}
        >
          <PrintButton onClick={handlePrintReceipt} isLoading={isPrinting} />
        </div>
      </div>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mt-12 mb-6">
          <h1 className="text-2xl font-bold">{t("receipts.details.title")}</h1>
        </div>
        <div className="bg-white shadow rounded-lg p-6 space-y-6">
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">{t("receipts.details.information")}</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">{t("receipts.details.receiptNumber")}</p>
                <p className="font-medium">{receipt.receiptNumber}</p>
              </div>
              <div>
                <p className="text-gray-600">{t("receipts.details.issueDate")}</p>
                <p className="font-medium">
                  {(() => {
                    const [year, month, day] = receipt.issueDate.split("-");
                    return `${day.padStart(2, "0")} - ${month.padStart(
                      2,
                      "0"
                    )} - ${year}`;
                  })()}
                </p>
              </div>
            </div>
          </section>

          {/* Métodos de Pago */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">{t("receipts.details.paymentMethods")}</h2>
            <div className="space-y-2">
              {receipt.paymentMethods.map((pm, index) => (
                <div
                  key={index}
                  className="grid grid-cols-2 gap-4 border-b pb-2"
                >
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
            <h2 className="text-xl font-semibold">{t("receipts.details.invoiceData")}</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">{t("receipts.details.invoiceNumber")}</p>
                <p className="font-medium">{invoice.invoiceNumber}</p>
              </div>
              <div>
                <p className="text-gray-600">{t("receipts.details.ruc")}</p>
                <p className="font-medium">{invoice.ruc}</p>
              </div>
              <div>
                <p className="text-gray-600">{t("receipts.details.client")}</p>
                <p className="font-medium">{invoice.clientName}</p>
              </div>
              <div>
                <p className="text-gray-600">{t("receipts.details.type")}</p>
                <p className="font-medium">
                  {invoice.type === "CASH"
                    ? t("invoices.type.cash")
                    : invoice.type === "CREDIT"
                    ? t("invoices.type.credit")
                    : invoice.type}
                </p>
              </div>
              <div>
                <p className="text-gray-600">{t("receipts.details.total")}</p>
                <p className="font-medium">
                  {invoice.total.toLocaleString("es-PY", {
                    style: "currency",
                    currency: "PYG",
                  })}
                </p>
              </div>
              <div>
                <p className="text-gray-600">{t("receipts.details.iva")}</p>
                <p className="font-medium">
                  {invoice.totalVat.toLocaleString("es-PY", {
                    style: "currency",
                    currency: "PYG",
                  })}
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
