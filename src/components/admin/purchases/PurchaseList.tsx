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
  const [from, setFrom] = useState<string | undefined>();
  const [to, setTo] = useState<string | undefined>();
  const [isGettingReport, setIsGettingReport] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);

  const t = useTranslations();
  const { data, query, setQuery, isLoading, error } = useGetPurchases({
    token,
    init: { from, to, page: 1 },
  });

  const handleGetPurchaseReport = async () => {
    if (!from || !to) {
      toast("error", t("error.errorLimitDate"));
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

  const hasActiveFilters = !!(
    query.providerId ||
    query.stockId ||
    query.totalMin ||
    query.totalMax ||
    from ||
    to
  );

  const resetFilters = () => {
    setIsFiltering(true)
    setQuery({
      providerId: undefined,
      stockId: undefined,
      totalMin: undefined,
      totalMax: undefined,
      from: undefined,
      to: undefined,
      page: 1,
    });
    setFrom(undefined);
    setTo(undefined);
    setIsFiltering(false)
  };

  const purchases = data?.data || [];

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {hasActiveFilters && (
        <div className="flex justify-end">
          <Button
          variant="ghost"
          size="sm"
          onClick={() => resetFilters()}
          className="text-sm h-8 px-2 text-gray-600 mr-[10px]"
          disabled={isFiltering}
          >
          Limpiar filtros
          </Button>
        </div>
      )}

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
          setDateTo={(val) => {
            setTo(val);
            setQuery((prev) => ({ ...prev, to: val }));
          }}
          setDateFrom={(val) => {
            setFrom(val);
            setQuery((prev) => ({ ...prev, from: val }));
          }}
        />
      </div>
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">{t("purchase.list.title")}</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            disabled={isGettingReport}
            onClick={() => router.push("/dashboard/purchases/register")}
          >
            {t("button.register")}
          </Button>
          <ExportButton
            handleGetReport={handleGetPurchaseReport}
            isLoading={isGettingReport}
          />
        </div>
      </div>

      {error && <p className="text-center text-red-500">{error}</p>}

      {isLoading ? (
        <PurchaseListSkeleton />
      ) : purchases.length === 0 ? (
        <p className="text-center">{t("purchase.list.emptyMessage")}</p>
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
