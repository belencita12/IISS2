"use client";

import { useRouter } from "next/navigation";
import MovementCard from "./MovementCard";
import { Button } from "@/components/ui/button";
import { useMovementList } from "@/hooks/movements/useMovementList";
import MovementFilters from "./MovementFilters";
import GenericPagination from "@/components/global/GenericPagination";
import { useEffect } from "react";
import { toast } from "@/lib/toast";
import MovementListSkeleton from "./skeleton/MovementListSkeleton";
import { useTranslations } from "next-intl";


interface Props {
  token: string;
}

export default function MovementListPage({ token }: Props) {
  const router = useRouter();
  const m = useTranslations("MovementDetail");
  const e = useTranslations("Error");
  const b = useTranslations("Button");

  const { data, query, setQuery, handleSearch, isLoading, error } =
    useMovementList({ token });
  
  useEffect(() => {
    if (error) {
      toast("error", error);
    }
  }, [error]);

  const movements = data?.data || [];

  return (
    <div className="max-w-6xl mx-auto p-4">
      <MovementFilters
        token={token}
        filters={query}
        setFilters={setQuery}
        onSearch={handleSearch}
      />

      <div className="flex justify-between items-center mb-6 w-full">
        <h1 className="text-2xl font-bold">{m("title")}</h1>
        <Button
          variant="default"
          onClick={() => router.push("/dashboard/movement/register")}
          className="bg-black text-white hover:bg-gray-800"
        >
          {b("register")}
        </Button>
      </div>

      {isLoading ? (
         <MovementListSkeleton />
      ) : movements.length === 0 ? (
        <p className="text-center">{e("notFoundField", {field: "movimientos"})}</p>
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
