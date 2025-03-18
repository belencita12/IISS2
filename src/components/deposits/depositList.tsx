"use client";

import React, { useState, useEffect } from "react";
import GenericTable, { Column, TableAction, PaginationInfo } from "@/components/global/GenericTable";
import { PencilIcon } from "lucide-react";

interface Deposit {
  id: number;
  name: string;
  location: string;
}

const DepositList = () => {
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    pageSize: 5,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchDeposits(pagination.currentPage);
  }, [pagination.currentPage]);

  const fetchDeposits = async (page: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/deposits?page=${page}&limit=${pagination.pageSize}`);
      const data = await response.json();
      setDeposits(data.items);
      setPagination({
        currentPage: data.currentPage,
        totalPages: data.totalPages,
        totalItems: data.totalItems,
        pageSize: pagination.pageSize,
      });
    } catch (error) {
      console.error("Error fetching deposits:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (deposit: Deposit) => {
    console.log("Editar depósito:", deposit);
    // Aquí podrías redirigir a una página de edición o abrir un modal
  };

  const columns: Column<Deposit>[] = [
    { header: "Nombre de Depósito", accessor: "name" },
    { header: "Ubicación", accessor: "location" },
  ];

  const actions: TableAction<Deposit>[] = [
    {
      icon: <PencilIcon className="w-5 h-5 text-blue-600" />, 
      onClick: handleEdit,
      label: "Editar",
    },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Lista de Depósitos</h2>
      <GenericTable
        data={deposits}
        columns={columns}
        actions={actions}
        pagination={pagination}
        onPageChange={(page) => setPagination((prev) => ({ ...prev, currentPage: page }))}
        isLoading={isLoading}
        emptyMessage="No hay depósitos disponibles."
      />
    </div>
  );
};

export default DepositList;
