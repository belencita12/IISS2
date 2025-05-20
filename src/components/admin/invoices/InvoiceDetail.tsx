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

  const i = useTranslations("InvoiceTable");
  const b = useTranslations("Button");

  useEffect(() => {
    if (error && typeof error === "object" && "message" in error) {
      toast("error", (error as Error).message);
    }
  }, [error]);

  if (loading) return <InvoiceDetailSkeleton/>;

  return (
    <div className="w-full px-0">
      {invoice && <InvoiceDetailCard invoice={invoice} />}
      <h3 className="text-xl font-semibold text-black mb-3 mt-3">{i("invoiceDetail")}</h3>
      <div className="w-full">
        <InvoiceDetailTable details={invoiceDetails} />
      </div>
<<<<<<< HEAD
      <div className="flex justify-end mt-6">
        <Link href="/dashboard/invoices">
          <Button
            variant="outline"
            className="px-6 border-gray-200 border-solid"
          >
            {b("toReturn")}
          </Button>
        </Link>
      </div>
=======
>>>>>>> c5184e1f40969a8fe3771af743fcbe1db6a0a22d
    </div>
  );
}
