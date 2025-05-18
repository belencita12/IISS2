"use client";

import React, { useEffect, useState, useCallback } from "react";
import DepositCard from "./DepositCard";
import { Button } from "../ui/button";
import { StockForm } from "../stock/register/StockForm";
import SearchBar from "@/components/global/SearchBar";
import { toast } from "@/lib/toast";
import { getStocks } from "@/lib/stock/getStock";
import { StockData } from "@/lib/stock/IStock";
import { deleteStockById } from "@/lib/stock/deleteStockById";
import GenericPagination from "../global/GenericPagination";
import DepositListSkeleton from "./skeleton/DepositListSkeleton";
import { useTranslations } from "next-intl";
import { FileDiff } from "lucide-react";

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

  const s = useTranslations("StockList");
  const b = useTranslations("Button");
  const e = useTranslations("Error");
  const sc= useTranslations("Success")

  const showDeposits = useCallback(
    async (page: number, token: string, search: string = "") => {
    try {
      setIsLoading(true);
      if (!token) {
        toast("error", e("authError"));
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
    } catch (error: unknown) {
      toast("error", error instanceof Error ? error.message : e("errorLoad", {field: "depositos"}));

    } finally {
      setIsLoading(false);
    }
  }, []);
  
  
  useEffect(() => {
    if (token) {
      showDeposits(currentPage, token);
    }
    
  }, [currentPage, token, showDeposits]);

  const handleAddDeposit = () => {
    setSelectedDeposit(null);
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
        <h2 className="text-2xl font-bold mb-4">{s("title")}</h2>
        <Button className="border border-gray-300 hover:bg-gray-800" onClick={handleAddDeposit}>
          {b("register")}
        </Button>
      </div>

      {isLoading && (
        <DepositListSkeleton/>
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
                    toast("error", e("noDelete", {field: deposit.name}));
                    return;
                  }

                  toast("success", sc("successDelete", {field: deposit.name}));
                  showDeposits(currentPage, token, searchTerm);
                } catch (error : unknown) {
                  toast("error", error instanceof Error ? error.message : e("noDelete", {field: deposit.name}));
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
