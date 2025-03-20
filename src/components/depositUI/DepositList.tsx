"use client";

import React, { useEffect, useState } from "react";
import DepositCard from "./DepositCard";
import { LoaderCircleIcon } from "lucide-react";

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

  useEffect(() => {
    const fetchDeposits = async () => {
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

        const response = await fetch(`${apiUrl}/stock?page=${currentPage}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        
        const data = await response.json();
        console.log("Datos obtenidos del API:", data);

        setDeposits(data.data);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Error fetching deposits:", error);
      }
      finally {
        setIsLoading(false);
      }
    };

    fetchDeposits();
  }, [currentPage, token]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Depósitos</h2>
        {
          isLoading && (
            <div className="space-y-4 flex justify-center items-center">
              <LoaderCircleIcon className="lucide lucide-loader-circle animate-spin" />
            </div>
          )
        }
      <div className="space-y-4">
        {deposits.map((deposit) => (
          <DepositCard key={deposit.id} nombre={deposit.name} ubicacion={deposit.address} id={deposit.id} />
        ))}
      </div>
      <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={`mx-1 px-3 py-1 rounded ${
              currentPage === index + 1 ? "bg-gray-500 text-white" : "bg-gray-300"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DepositList;
