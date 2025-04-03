"use client";

import { useRouter } from "next/navigation";
import MovementCard from "./MovementCard";
import { Button } from "@/components/ui/button";
import { useMovementList } from "@/hooks/movements/useMovementList";
import MovementFilters from "./MovementFilters";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

interface Props {
  token: string;
}

export default function MovementListPage({ token }: Props) {
  const router = useRouter();
  const { data, query, setQuery, handleSearch, isLoading, error } =
    useMovementList({ token });

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

      {error && <p className="text-center text-red-500">{error}</p>}

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
        <Pagination className="mt-6">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() =>
                  setQuery((prev) => ({ ...prev, page: (prev.page ?? 1) - 1 }))
                }
                className={data.prev ? "" : "pointer-events-none opacity-50"}
              />
            </PaginationItem>

            {Array.from({ length: data.totalPages }, (_, i) => i + 1).map(
              (page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    isActive={data.currentPage === page}
                    onClick={() => setQuery((prev) => ({ ...prev, page }))}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              )
            )}

            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  setQuery((prev) => ({ ...prev, page: (prev.page ?? 1) + 1 }))
                }
                className={data.next ? "" : "pointer-events-none opacity-50"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
