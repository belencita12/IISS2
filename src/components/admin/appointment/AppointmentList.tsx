"use client";

import { useEffect, useState } from "react";
import { toast } from "@/lib/toast";
import {
  AppointmentData,
  AppointmentQueryParams,
  AppointmentStatus,
} from "@/lib/appointment/IAppointment";
import { APPOINTMENT_API } from "@/lib/urls";
import { usePaginatedFetch } from "@/hooks/api/usePaginatedFetch";
import SearchBar from "@/components/global/SearchBar";
import AppointmentDateFilter from "./filters/AppointmentDateFilter";
import AppointmentStatusFilter from "./filters/AppointmentStatusFilter";
import AppointmentCard from "./AppointmentCard";
import GenericPagination from "@/components/global/GenericPagination";
import { ConfirmationModal } from "@/components/global/Confirmation-modal";
import { completeAppointment, cancelAppointment } from "@/lib/appointment/service";
import { Modal } from "@/components/global/Modal";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import AppointmentListSkeleton from "./skeleton/AppointmentListSkeleton";

interface AppointmentListProps {
  token: string;
}

const AppointmentList = ({ token }: AppointmentListProps) => {
  const router = useRouter();
  const [filters, setFilters] = useState<AppointmentQueryParams>({
    page: 1,
    search: undefined,
    fromDesignatedDate: undefined,
    toDesignatedDate: undefined,
    status: undefined,
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentData | null>(null);
  const [modalAction, setModalAction] = useState<"complete" | "cancel" | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelDescription, setCancelDescription] = useState("");

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
    autoFetch: true,
    extraParams: {
      search: filters.search,
      fromDesignatedDate: filters.fromDesignatedDate,
      toDesignatedDate: filters.toDesignatedDate,
      status: filters.status,
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
    setFilters((prev) => ({ ...prev, search: value }));
    search({ search: value });
  };

  const openConfirmModal = (appointment: AppointmentData, action: "complete" | "cancel") => {
    if (action === "complete") {
      const appointmentDate = new Date(appointment.designatedDate);
      const currentDate = new Date();

      // Set hours, minutes, seconds, and milliseconds to 0 for both dates to compare only the date part
      appointmentDate.setHours(0, 0, 0, 0);
      currentDate.setHours(0, 0, 0, 0);

      if (appointmentDate > currentDate) {
        toast("error", "No se puede finalizar una cita antes de su fecha programada.");
        return;
      }
    }
    setSelectedAppointment(appointment);
    setModalAction(action);
    if (action === "cancel") {
      setCancelModalOpen(true);
    } else {
      setIsModalOpen(true);
    }
  };

  const handleConfirmAction = async () => {
    if (!selectedAppointment || !modalAction) return;

    try {
      setIsProcessing(true);
      if (modalAction === "complete") {
        await completeAppointment(selectedAppointment.id, token);
      } else {
        await cancelAppointment(selectedAppointment.id, token, cancelDescription);
      }
      toast("success", `Cita ${modalAction === "complete" ? "finalizada" : "cancelada"} con éxito`);
      refresh();
    } catch (error) {
      toast("error", "Ocurrió un error al actualizar la cita");
    } finally {
      setIsProcessing(false);
      setIsModalOpen(false);
      setCancelModalOpen(false);
      setSelectedAppointment(null);
      setModalAction(null);
      setCancelDescription("");
    }
  };

  if (error) toast("error", error.message || "Error al cargar las citas");

  return (
    <div className="p-4 mx-auto">
      <div className="max-w-8xl mx-auto p-4 space-y-6">
        <SearchBar
          placeholder="Buscar por nombre o RUC del cliente"
          onSearch={handleSearch}
        />
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <AppointmentDateFilter filters={filters} setFilters={handleFilterChange} />
          </div>
          <div className="flex-1">
            <AppointmentStatusFilter filters={filters} setFilters={handleFilterChange} />
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold">Citas</h2>
        <Button variant="outline" className="px-6" onClick={() => router.push("/dashboard/appointment/register")}>
          Agendar
        </Button>
      </div>

      {isLoading ? (
        <AppointmentListSkeleton />
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
                onOpenModal={openConfirmModal}
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

      {selectedAppointment && modalAction === "complete" && (
        <ConfirmationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleConfirmAction}
          title="Confirmar Finalización"
          message="¿Estás seguro de que quieres finalizar esta cita?"
          confirmText="Confirmar"
          cancelText="Cancelar"
          isLoading={isProcessing}
        />
      )}

      {selectedAppointment && modalAction === "cancel" && (
        <Modal
          isOpen={cancelModalOpen}
          onClose={() => setCancelModalOpen(false)}
          title="Motivo de cancelación"
          size="md"
        >
          <textarea
            className="w-full h-32 p-2 border border-gray-300 rounded"
            placeholder="Escribe una razón para cancelar la cita"
            value={cancelDescription}
            onChange={(e) => setCancelDescription(e.target.value)}
          />
          <div className="flex justify-end mt-4 gap-2">
            <Button
              className="bg-white text-black px-4 py-2 rounded border hover:bg-gray-100"
              onClick={() => setCancelModalOpen(false)}
              disabled={isProcessing}
            >
              Cancelar
            </Button>
            <Button
              className="bg-red-600 text-white px-4 py-2 rounded border hover:bg-red-700"
              onClick={handleConfirmAction}
              disabled={isProcessing || !cancelDescription.trim()}
            >
              {isProcessing ? "Cancelando..." : "Confirmar"}
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AppointmentList;
