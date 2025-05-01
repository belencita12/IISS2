"use client";

import { useState } from "react";
import { toast } from "@/lib/toast";
import { AppointmentData, AppointmentQueryParams } from "@/lib/appointment/IAppointment";
import { APPOINTMENT_API } from "@/lib/urls";
import { usePaginatedFetch } from "@/hooks/api/usePaginatedFetch";
import SearchBar from "@/components/global/SearchBar";
import AppointmentCard from "./AppointmentCard";
import GenericPagination from "@/components/global/GenericPagination";

interface AppointmentListProps {
  token: string;
}

const AppointmentList = ({ token }: AppointmentListProps) => {
  const [filters, setFilters] = useState<AppointmentQueryParams>({
    page: 1,
    clientRuc: undefined,
  });

  const [isProcessing, setIsProcessing] = useState(false);

  const {
    data,
    loading: isLoading,
    error,
    pagination = { currentPage: 1, totalPages: 1, totalItems: 0, pageSize: 10 },
    setPage,
    search,
    refresh,
  } = usePaginatedFetch<AppointmentData>(APPOINTMENT_API, token, {
    initialPage: 1,
    size: 7,
    autoFetch: true,
    extraParams: {
      clientRuc: filters.clientRuc,
    },
  });

  const handleFilterChange = (updatedFilters: AppointmentQueryParams) => {
    const { page, size, ...safeFilters } = updatedFilters;
    setFilters((prev) => ({
      ...prev,
      ...safeFilters,
      page: 1,
    }));
    search(safeFilters as Record<string, unknown>);
  };

  const handleSearch = (value: string) => {
    setFilters((prev) => ({ ...prev, clientRuc: value }));
    search({ clientRuc: value });
  };

  if (error) toast("error", error.message || "Error al cargar las citas");

  return (
    <div className="p-4 mx-auto">
      <div className="max-w-6xl mx-auto p-4 space-y-6">
        <SearchBar
          placeholder="Buscar por RUC del cliente"
          onSearch={handleSearch}
        />
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold">Citas</h2>
      </div>

      {isLoading ? (
        <p className="text-center text-black">Cargando citas...</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {data?.length ? (
            data.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                token={token}
                onChange={refresh}
                isProcessing={isProcessing}
                setIsProcessing={setIsProcessing}
              />
            ))
          ) : (
            <p>No se encontraron citas.</p>
          )}
        </div>
      )}

      <GenericPagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        handlePreviousPage={() => setPage(pagination.currentPage - 1)}
        handleNextPage={() => setPage(pagination.currentPage + 1)}
        handlePageChange={setPage}
      />
    </div>
  );
};

export default AppointmentList;
