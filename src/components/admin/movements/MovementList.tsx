"use client";

import { useRouter } from "next/navigation";
import MovementCard from "./MovementCard";
import { Button } from "@/components/ui/button";
import { useMovementList } from "@/hooks/movements/useMovementList";
import MovementFilters from "./MovementFilters";
import GenericPagination from "@/components/global/GenericPagination";
import { useEffect } from "react";
import { toast } from "@/lib/toast";


interface Props {
  token: string;
}

export default function MovementListPage({ token }: Props) {
  const router = useRouter();
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
        <h1 className="text-2xl font-bold">Movimientos</h1>
        <Button
          variant="default"
          onClick={() => router.push("/dashboard/movement/register")}
          className="bg-black text-white hover:bg-gray-800"
        >
          Registrar Movimiento
        </Button>
      </div>

      {isLoading ? (
        <p className="text-center">Cargando movimientos...</p>
      ) : movements.length === 0 ? (
        <p className="text-center">No hay movimientos registrados.</p>
      ) : (
        <div className="flex flex-col gap-4 w-full">
          {movements.map((movement) => (
            <MovementCard key={movement.id} movement={movement} token={token} />
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
