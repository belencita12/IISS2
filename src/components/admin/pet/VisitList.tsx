"use client";

import { useState } from "react";
import { usePaginatedFetch } from "@/hooks/api/usePaginatedFetch";
import { APPOINTMENT_API } from "@/lib/urls";
import { AppointmentData, AppointmentQueryParams } from "@/lib/appointment/IAppointment";
import AppointmentCard from "@/components/admin/appointment/AppointmentCard";
import AppointmentStatusFilter from "@/components/admin/appointment/filters/AppointmentStatusFilter";
import GenericPagination from "@/components/global/GenericPagination";

interface VisitListProps {
  token: string;
  petId: number;
}

export default function VisitList({ token, petId }: VisitListProps) {
  const [filters, setFilters] = useState<AppointmentQueryParams>({
    page: 1,
    status: undefined,
    petId,
  });

  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const {
    data: appointments,
    loading,
    error,
    pagination,
    setPage,
    search,
  } = usePaginatedFetch<AppointmentData>(APPOINTMENT_API, token, {
    initialPage: 1,
    size: 3,
    autoFetch: true,
    extraParams: { petId: filters.petId, status: filters.status },
  });

  const sortedAppointments = [...appointments].sort((a, b) => {
    const dateA = new Date(a.designatedDate).getTime();
    const dateB = new Date(b.designatedDate).getTime();
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  const handleStatusChange = (newFilters: AppointmentQueryParams) => {
    setFilters({ ...filters, ...newFilters, page: 1 });
    search({ petId, status: newFilters.status });
  };

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-4">
        <AppointmentStatusFilter filters={filters} setFilters={handleStatusChange} />
        <div className="space-y-2">
          <label className="text-sm font-medium">Ordenar por fecha</label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
            className="border rounded p-2"
          >
            <option value="desc">Más recientes primero</option>
            <option value="asc">Más antiguas primero</option>
          </select>
        </div>
      </div>

      {/* Lista */}
      {loading ? (
        <p className="text-center">Cargando visitas...</p>
      ) : error ? (
        <p className="text-center text-red-500">Error al cargar visitas.</p>
      ) : sortedAppointments.length === 0 ? (
        <p className="text-center text-gray-600">Esta mascota aún no tiene visitas registradas.</p>
      ) : (
        sortedAppointments.map((appointment) => (
          <AppointmentCard key={appointment.id} appointment={appointment} token={token} />
        ))
      )}

      {/* Paginación */}
      {pagination && pagination.totalPages > 1 && (
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
