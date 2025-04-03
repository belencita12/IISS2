"use client";

import { useRouter } from "next/navigation";
import MovementCard from "./MovementCard";
import { Button } from "@/components/ui/button";
import { useMovementList } from "@/hooks/movements/useMovementList";
import MovementFilters from "./MovementFilters";

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
        filters={query}
        setFilters={setQuery}
        onSearch={handleSearch}
      />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Movimientos</h1>
        <Button
          variant="default"
          onClick={() => router.push("/dashboard/movements/register")}
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
        movements.map((movement) => (
          <MovementCard key={movement.id} movement={movement} />
        ))
      )}
      {data && data.totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          <Button
            disabled={!data.prev}
            onClick={() =>
              setQuery((prev) => ({ ...prev, page: (prev.page ?? 1) - 1 }))
            }
          >
            Anterior
          </Button>
          <Button
            disabled={!data.next}
            onClick={() =>
              setQuery((prev) => ({ ...prev, page: (prev.page ?? 1) + 1 }))
            }
          >
            Siguiente
          </Button>
        </div>
      )}
    </div>
  );
}
