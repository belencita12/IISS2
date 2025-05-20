"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGetPurchases } from "@/hooks/purchases/useGetPurchases";
import { Button } from "@/components/ui/button";
import PurchaseCard from "./PurchaseCard";
import GenericPagination from "@/components/global/GenericPagination";
import PurchaseSelectFilter from "./filters/PurchaseSelectFilter";
import PurchaseNumericFilter from "./filters/PurchaseNumericFilter";
import PurchaseListSkeleton from "./skeleton/PurchaseListSkeleton";

import DateFilter from "./filters/PurchaseDateFilter";
import { getPurchaseReport } from "@/lib/purchases/getPurchaseReport";
import { downloadFromBlob } from "@/lib/utils";
import ExportButton from "@/components/global/ExportButton";
import { toast } from "@/lib/toast";

import { useTranslations } from "next-intl";


interface Props {
  token: string;
}

export default function PurchaseList({ token }: Props) {
  const router = useRouter();
  const { data, query, setQuery, isLoading, error } = useGetPurchases({
    token,
  });
  const [from, setFrom] = useState<string | undefined>();
  const [to, setTo] = useState<string | undefined>();
  const [isGettingReport, setIsGettingReport] = useState(false);

  const handleGetPurchaseReport = async () => {
    if (!from || !to) {
      toast("error", "Se necesitan fechas limites para generar el reporte");
    } else {
      setIsGettingReport(true);
      const result = await getPurchaseReport({
        token,
        from,
        to,
      });
      if (!(result instanceof Blob)) toast("error", result.message);
      else downloadFromBlob(result);
      setIsGettingReport(false);
    }
  };

  const p = useTranslations("PurchaseDetail");
  const b = useTranslations("Button");
  const e = useTranslations("Error");

  const purchases = data?.data || [];

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <PurchaseSelectFilter
        token={token}
        filters={query}
        setFilters={setQuery}
      />

      <PurchaseNumericFilter filters={query} setFilters={setQuery} />

      <div className="p-2 mb-2">
        <DateFilter
          to={to}
          from={from}
          setDateTo={setTo}
          setDateFrom={setFrom}
        />
      </div>

      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Compras</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            disabled={isGettingReport}
            onClick={() => router.push("/dashboard/purchases/register")}
          >
            Registrar Compra
          </Button>
          <ExportButton
            handleGetReport={handleGetPurchaseReport}
            isLoading={isGettingReport}
          />
        </div>



      <div className="flex justify-between items-center mb-6 w-full">
        <h1 className="text-2xl font-bold">{p("title")}</h1>
        <Button
          variant="default"
          onClick={() => router.push("/dashboard/purchases/register")}
          className="bg-black text-white hover:bg-gray-800"
        >
          {b("register")}
        </Button>

      </div>

      {error && <p className="text-center text-red-500">{error}</p>}

      {isLoading ? (
        <PurchaseListSkeleton />
      ) : purchases.length === 0 ? (
        <p className="text-center">{e("notFoundField", {field: "compras"})}</p>
      ) : (
        purchases.map((purchase) => (
          <PurchaseCard key={purchase.id} purchase={purchase} />
        ))
      )}

      {data && data.totalPages > 1 && (
        <GenericPagination
          currentPage={data.currentPage}
          totalPages={data.totalPages}
          handlePreviousPage={() =>
            setQuery((prev) => ({ ...prev, page: (prev.page ?? 1) - 1 }))
          }
          handleNextPage={() =>
            setQuery((prev) => ({ ...prev, page: (prev.page ?? 1) + 1 }))
          }
          handlePageChange={(page) => setQuery((prev) => ({ ...prev, page }))}
        />
      )}
    </div>
  );
}
