"use client";

import { useState } from "react";
import { usePaginatedFetch } from "@/hooks/api/usePaginatedFetch";
import { APPOINTMENT_API } from "@/lib/urls";
import { AppointmentData, AppointmentQueryParams } from "@/lib/appointment/IAppointment";
import AppointmentCard from "@/components/admin/appointment/AppointmentCard";
import AppointmentDateFilter from "@/components/admin/appointment/filters/AppointmentDateFilter";
import AppointmentStatusFilter from "@/components/admin/appointment/filters/AppointmentStatusFilter";
import GenericPagination from "@/components/global/GenericPagination";

interface VisitListProps {
  token: string;
  petId: number;
}

export default function VisitList({ token, petId }: VisitListProps) {
  const [filters, setFilters] = useState<AppointmentQueryParams>({
    page: 1,
    petId,
    status: undefined,
    fromDesignatedDate: undefined,
    toDesignatedDate: undefined,
  });

  const {
    data: appointments,
    loading,
    error,
    pagination = { currentPage: 1, totalPages: 1, totalItems: 0, pageSize: 3 },
    setPage,
    search,
  } = usePaginatedFetch<AppointmentData>(APPOINTMENT_API, token, {
    initialPage: filters.page ?? 1,
    size: 3,
    autoFetch: true,
    extraParams: {
      petId: filters.petId,
      status: filters.status,
      fromDesignatedDate: filters.fromDesignatedDate,
      toDesignatedDate: filters.toDesignatedDate,
    },
  });

  const handleFilterChange = (updatedFilters: AppointmentQueryParams) => {
    const { page, size, ...safeFilters } = updatedFilters;
    setFilters({ ...filters, ...safeFilters, page: 1 });
    search({ ...filters, ...safeFilters });
  };

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AppointmentDateFilter filters={filters} setFilters={handleFilterChange} />
        <AppointmentStatusFilter filters={filters} setFilters={handleFilterChange} />
      </div>

      {/* Lista */}
      {loading ? (
        <p className="text-center">Cargando visitas...</p>
      ) : error ? (
        <p className="text-center text-red-500">Error al cargar visitas.</p>
      ) : appointments.length === 0 ? (
        <p className="text-center text-gray-600">
          Esta mascota aún no tiene visitas registradas.
        </p>
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <AppointmentCard key={appointment.id} appointment={appointment} token={token} />
          ))}
        </div>
      )}

      {/* Paginación */}
      {pagination.totalPages > 1 && (
        <GenericPagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          handlePageChange={setPage}
          handlePreviousPage={() => setPage(pagination.currentPage - 1)}
          handleNextPage={() => setPage(pagination.currentPage + 1)}
        />
      )}
    </div>
  );
}
