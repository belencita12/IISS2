"use client";

import React, { useEffect, useState, useCallback } from "react";
import DepositCard from "./DepositCard";
import { LoaderCircleIcon } from "lucide-react";
import { Button } from "../ui/button";
import { StockForm } from "../stock/register/StockForm";
import SearchBar from "@/components/global/SearchBar";
import { toast } from "@/lib/toast";
import { getStocks } from "@/lib/stock/getStock";
import { StockData } from "@/lib/stock/IStock";
import { deleteStockById } from "@/lib/stock/deleteStockById";
import GenericPagination from "../global/GenericPagination";

interface DepositListProps {
  token?: string;
}

const DepositList: React.FC<DepositListProps> = ({ token = "" }) => {
  const [deposits, setDeposits] = useState<StockData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [allDeposits, setAllDeposits] = useState<StockData[]>([]);
  const [selectedDeposit, setSelectedDeposit] = useState<StockData | null>(null);

  const showDeposits = useCallback(
    async (page: number, token: string, search: string = "") => {
    try {
      setIsLoading(true);
      if (!token) {
        console.error("Error: No hay token de autenticación");
        return;
      }

      const data = await getStocks({ page, name: search }, token);

      const cleanedData: StockData[] = data.data
        .filter((item): item is StockData & {id: number} => typeof item.id === 'number')
        .map((item) => ({
          id: item.id,
          name: item.name,
          address: item.address,
        }));

      setDeposits(cleanedData);
      setTotalPages(data.totalPages);
      setAllDeposits(cleanedData);
    } catch (error) {
      console.error("Error al obtener los depósitos:", error);
      toast("error", "Ocurrió un error al cargar los depósitos.");

    } finally {
      setIsLoading(false);
    }
  }, []);
  
  
  useEffect(() => {
    if (token) {
      showDeposits(currentPage, token);
    }
    
  }, [currentPage, token, showDeposits]);

  const handleSearch = () => {
    if (token) {
      setCurrentPage(1);
      showDeposits(currentPage, token, searchTerm);
    }
  }

  const handleAddDeposit = () => {
    setIsModalOpen(true); 
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="p-6">
      <SearchBar
        onSearch={(term) => {
          setSearchTerm(term);
          setCurrentPage(1);
          showDeposits(1, token, term);
        }}
      />

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold mb-4">Depósitos</h2>
        <Button className="border border-gray-300 hover:bg-gray-800" onClick={handleAddDeposit}>
          Registrar Deposito
        </Button>
      </div>

      {isLoading && (
        <div className="space-y-4 flex justify-center items-center">
          <LoaderCircleIcon className="lucide lucide-loader-circle animate-spin" />
        </div>
      )}
      {!isLoading && (
        <div className="space-y-4">
          {deposits.map((deposit) => (
            <DepositCard
              key={deposit.id}
              nombre={deposit.name}
              ubicacion={deposit.address}
              id={deposit.id}
              onEdit={(id) => {
                const selected = deposits.find((d) => d.id === id);
                if(selected) {
                  setSelectedDeposit(selected);
                  setIsModalOpen(true);
                }
              }}
              onDelete={async (id) => {
                try {
                  const success = await deleteStockById(id, token);
                  if (!success) {
                    toast("error", "No se pudo eliminar el depósito.");
                    return;
                  }

                  toast("success", "Depósito eliminado correctamente ✅");
                  showDeposits(currentPage, token, searchTerm);
                } catch (error) {
                  console.error("Error al eliminar el deposito", error);
                  toast("error", "Ocurrió un error al eliminar el depósito.");
                }
              }}
            />
          ))}
        </div>
      )}

      <GenericPagination
        currentPage={currentPage}
        totalPages={totalPages}
        handlePageChange={(page) => setCurrentPage(page)}
        handlePreviousPage={() => {
          if (currentPage > 1) setCurrentPage(currentPage - 1);
        }}
        handleNextPage={() => {
          if (currentPage < totalPages) setCurrentPage(currentPage + 1);
        }}
      />

      {isModalOpen && (
        <StockForm token={token}
          isOpen={isModalOpen}
          onClose={handleCloseModal} 
          onRegisterSuccess={() => {
            showDeposits(1, token);
            setCurrentPage(1);
          }}
          initialData={selectedDeposit}
        />
      )}
    </div>
  );
}

export default DepositList;
