"use client";
import { useEffect, useState } from "react";
import { getPurchases } from "@/lib/purchase/getPurchases";
import { Button } from "@/components/ui/button";
import PurchaseCard from "./PurchaseCard";
import { PurchaseData } from "@/lib/purchase/IPurchase";
import { toast } from "@/lib/toast";
import PurchaseFilter from "./PurchaseFilter";
import GenericPagination from "@/components/global/GenericPagination";

interface PurchaseListProps {
  token: string | null;
}

export default function PurchaseList({ token }: PurchaseListProps) {
  const [purchases, setPurchases] = useState<PurchaseData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    provider: "all",
    deposito: "all",
    
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);  


  const fetchPurchases = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await getPurchases(currentPage, "", token, {
        providerId: filters.provider !== "all" ? filters.provider : undefined,
        stockId: filters.deposito !== "all" ? filters.deposito : undefined,
      });
      console.log("📦 Respuesta de la API:", data);
      setPurchases(data.data || []);
      setTotalPages(data.totalPages || 1); 
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast("error", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setCurrentPage(1); 
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    fetchPurchases();
  }, [token, filters, currentPage]); 

  return (
    <div className="p-4 mx-auto">
      <PurchaseFilter
        token={token || ""}
        provider={filters.provider}
        deposito={filters.deposito}
        onFilterChange={handleApplyFilters}
      />

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold">Compras</h2>
        <Button className="px-6">Registrar Compra</Button>
      </div>

      {loading ? (
        <p className="text-gray-600">Cargando compras...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="space-y-4">
          {purchases.map((purchase) => (
            <PurchaseCard key={purchase.id} purchase={purchase} />
          ))}
        </div>
      )}

      <GenericPagination
        handlePreviousPage={handlePreviousPage}
        handlePageChange={handlePageChange}
        handleNextPage={handleNextPage}
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </div>
  );
}
