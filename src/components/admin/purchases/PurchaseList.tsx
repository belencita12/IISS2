"use client";

import { useRouter } from "next/navigation";
import { useGetPurchases } from "@/hooks/purchases/useGetPurchases";
import { Button } from "@/components/ui/button";
import PurchaseCard from "./PurchaseCard";
import GenericPagination from "@/components/global/GenericPagination";
import PurchaseSelectFilter from "./filters/PurchaseSelectFilter";

interface Props {
  token: string;
}

export default function PurchaseList({ token }: Props) {

  const router = useRouter();
  const { data, query, setQuery,  isLoading, error } = useGetPurchases({ token });

  const purchases = data?.data || [];

  return (
    <div className="max-w-6xl mx-auto p-4">
      <PurchaseSelectFilter
        token={token}
        filters={query}
        setFilters={setQuery}

      />

      <div className="flex justify-between items-center mb-6 w-full">
        <h1 className="text-2xl font-bold">Compras</h1>
        <Button
          variant="default"
          onClick={() => router.push("/dashboard/purchase/register")}
          className="bg-black text-white hover:bg-gray-800"
        >
          Registrar Compra
        </Button>
      </div>

      {error && <p className="text-center text-red-500">{error}</p>}

      {isLoading ? (
        <p className="text-center">Cargando compras...</p>
      ) : purchases.length === 0 ? (
        <p className="text-center">No hay compras registradas.</p>
      ) : (
        <div className="flex flex-col gap-4 w-full">
          {purchases.map((purchase) => (
            <PurchaseCard key={purchase.id} purchase={purchase} />
          ))}
        </div>
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
