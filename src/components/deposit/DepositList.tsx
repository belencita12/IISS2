"use client";

import React, { useEffect, useState, useCallback } from "react";
import DepositCard from "./DepositCard";
import { LoaderCircleIcon } from "lucide-react";
import { Button } from "../ui/button";
import { StockForm } from "../stock/register/StockForm";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext,} from "../ui/pagination";
interface Deposit {
  id: number;
  name: string;
  address: string;
}

interface DepositListProps {
  token?: string;
}

const DepositList: React.FC<DepositListProps> = ({ token = "" }) => {
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [allDeposits, setAllDeposits] = useState<Deposit[]>([]);

  const fetchDeposits = useCallback(async (
    page: number, token: string, search: string = ""
  ) => {
    try {
      setIsLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_BASE_URL;
      if (!apiUrl) {
        console.error("Error: NEXT_PUBLIC_BASE_URL no está definido");
        return;
      }
      if (!token) {
        console.error("Error: No hay token de autenticación");
        return;
      }
  
      const params = new URLSearchParams();
      params.append("page", page.toString());
      if (search) params.append("name", search);
  
      const response = await fetch(`${apiUrl}/stock?${params.toString()}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error("Error al obtener los depósitos");
      }
  
      const data = await response.json();
      setAllDeposits(data.data);
      setDeposits(data.data);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching deposits:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  
  useEffect(() => {
    if (token) {
      fetchDeposits(currentPage, token);
    }
    
  }, [currentPage, token, fetchDeposits]);

  const handleSearch = () => {
    if (token) {
      setCurrentPage(1);
      fetchDeposits(currentPage, token, searchTerm);
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
      <div className="flex flex-col md:flex-row gap-4 mb-4 items-center">
        <input
          type="text"
          placeholder="Nombre de Sucursal..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2 w-full"
        />
        <Button onClick={handleSearch} className="w-full md:w-auto">
          Buscar
        </Button>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold mb-4">Depósitos</h2>
        <Button className="border border-gray-300 hover:bg-gray-100" onClick={handleAddDeposit}>
          Registrar Deposito
        </Button>
      </div>

      {isLoading && (
        <div className="space-y-4 flex justify-center items-center">
          <LoaderCircleIcon className="lucide lucide-loader-circle animate-spin" />
        </div>
      )}
      <div className="space-y-4">
        {deposits.map((deposit) => (
          <DepositCard key={deposit.id} nombre={deposit.name} ubicacion={deposit.address} id={deposit.id} />
        ))}
      </div>

      <Pagination className="mt-6">
        <PaginationContent>
          <PaginationPrevious onClick={() => {
              if (currentPage > 1) setCurrentPage(currentPage - 1);
          }}/>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <PaginationItem key={page}>
              <PaginationLink isActive={page === currentPage} href="#" onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage(page);
                }}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationNext onClick={() => {
            if (currentPage < totalPages) setCurrentPage(currentPage + 1);
          }}/>
        </PaginationContent>
      </Pagination>

      {isModalOpen && (
        <StockForm token={token} isOpen={isModalOpen} onClose={handleCloseModal} 
         onRegisterSuccess={() => {
          fetchDeposits(1, token);
          setCurrentPage(1);
         }}/>
      )}
    </div>
  );
}

export default DepositList;
