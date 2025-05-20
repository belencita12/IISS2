"use client";

import { useRouter } from "next/navigation";
import { useGetPurchases } from "@/hooks/purchases/useGetPurchases";
import { Button } from "@/components/ui/button";
import PurchaseCard from "./PurchaseCard";
import GenericPagination from "@/components/global/GenericPagination";
import PurchaseSelectFilter from "./filters/PurchaseSelectFilter";
import PurchaseNumericFilter from "./filters/PurchaseNumericFilter";
import PurchaseListSkeleton from "./skeleton/PurchaseListSkeleton";
import { useTranslations } from "next-intl";

interface Props {
  token: string;
}

export default function PurchaseList({ token }: Props) {

  const router = useRouter();
  const { data, query, setQuery,  isLoading, error } = useGetPurchases({ token });

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

      <PurchaseNumericFilter
        filters={query}
        setFilters={setQuery}
      />

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
            setQuery((prev) => ({ ...prev, page: (prev.page ?? 1) - 1 }))}
          handleNextPage={() =>
            setQuery((prev) => ({ ...prev, page: (prev.page ?? 1) + 1 }))}
          handlePageChange={(page) =>
            setQuery((prev) => ({ ...prev, page }))}
        />
      )}
    </div>
  );
}
