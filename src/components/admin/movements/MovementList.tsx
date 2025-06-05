"use client";

import { useRouter } from "next/navigation";
import MovementCard from "./MovementCard";
import { Button } from "@/components/ui/button";
import { useMovementList } from "@/hooks/movements/useMovementList";
import MovementFilters from "./MovementFilters";
import GenericPagination from "@/components/global/GenericPagination";
import { useEffect, useState } from "react";
import { toast } from "@/lib/toast";
import MovementListSkeleton from "./skeleton/MovementListSkeleton";
import { useTranslations } from "next-intl";


interface Props {
  token: string;
}

export default function MovementListPage({ token }: Props) {
  const [isFiltering, setIsFiltering] = useState(false);
  const [resetCounter, setResetCounter] = useState(0);
  const router = useRouter();
  const m = useTranslations("MovementDetail");
  const t = useTranslations();

  const { data, query, setQuery, handleSearch, isLoading, error } =
    useMovementList({ token });
  
  useEffect(() => {
    if (error) {
      toast("error", error);
    }
  }, [error]);

  const hasActiveFilters = !!(
    query.type ||
    query.originStockId ||
    query.destinationStockId ||
    query.managerId ||
    query.productName
  );

  const resetFilters = () => {
    setIsFiltering(true)
    setQuery({
      type: "",
      originStockId: undefined,
      destinationStockId: undefined,
      managerId: undefined,
      productName: "",
      page: 1,
    });
    handleSearch();
    setIsFiltering(false)
    setResetCounter((prev) => prev + 1);
  };

  const movements = data?.data || [];

  return (
    <div className="max-w-6xl mx-auto p-4">

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

      <MovementFilters
        token={token}
        filters={query}
        setFilters={setQuery}
        onSearch={handleSearch}
        resetCounter={resetCounter}
      />

      <div className="flex justify-between items-center mb-6 w-full">
        <h1 className="text-2xl font-bold">{t("movement.table.title")}</h1>
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard/movement/register")}
          className="px-6"
        >
          {t("button.register")}
        </Button>
      </div>

      {isLoading ? (
        <MovementListSkeleton />
      ) : movements.length === 0 ? (
        <p className="text-center">{t("movement.table.emptyMessage")}</p>
      ) : (
        <div className="flex flex-col gap-4 w-full">
          {movements.map((movement) => (
            <div
            key={movement.id}
            onClick={() => router.push(`/dashboard/movement/${movement.id}`)}
            className="cursor-pointer"
          >
          <MovementCard movement={movement} token={token} />
        </div>
      ))}
        </div>
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
