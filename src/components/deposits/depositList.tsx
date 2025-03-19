"use client";

import React, { useState, useEffect } from "react";
import GenericTable, { Column, TableAction, PaginationInfo } from "@/components/global/GenericTable";
import { PencilIcon } from "lucide-react";

interface Deposit {
  id: number;
  nombre: string;
  direccion: string;
}

const mockDeposits: Deposit[] = [
  { id: 1, nombre: "Depósito Central", direccion: "Av. Principal 123" },
  { id: 2, nombre: "Bodega Norte", direccion: "Calle 45 #23-10" },
  { id: 3, nombre: "Almacén Sur", direccion: "Carrera 12 #8-19" },
  { id: 4, nombre: "Depósito Este", direccion: "Av. Industrial 567" },
  { id: 5, nombre: "Depósito Oeste", direccion: "Calle 9 #17-22" },
  { id: 6, nombre: "Centro de Distribución", direccion: "Diagonal 32 #4-56" },
];

const DepositList = () => {
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalItems: mockDeposits.length,
    pageSize: 5,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchDeposits(pagination.currentPage);
  }, [pagination.currentPage]);

  const fetchDeposits = (page: number) => {
    setIsLoading(true);
    setTimeout(() => {
      const startIndex = (page - 1) * pagination.pageSize;
      const endIndex = startIndex + pagination.pageSize;
      setDeposits(mockDeposits.slice(startIndex, endIndex));
      setPagination({
        currentPage: page,
        totalPages: Math.ceil(mockDeposits.length / pagination.pageSize),
        totalItems: mockDeposits.length,
        pageSize: pagination.pageSize,
      });
      setIsLoading(false);
    }, 500);
  };

  const handleEdit = (deposit: Deposit) => {
    console.log("Editar depósito:", deposit);
  };

  const columns: Column<Deposit>[] = [
    { header: "Nombre de Depósito", accessor: "nombre" },
    { header: "Dirección", accessor: "direccion" },
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
