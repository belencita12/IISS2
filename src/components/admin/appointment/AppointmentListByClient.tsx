"use client";

import { useState, useEffect } from "react";
import { toast } from "@/lib/toast";
import type {
  AppointmentData,
  AppointmentQueryParams,
} from "@/lib/appointment/IAppointment";
import { APPOINTMENT_API } from "@/lib/urls";
import { usePaginatedFetch } from "@/hooks/api/usePaginatedFetch";
import AppointmentCard from "./AppointmentCard";
import GenericPagination from "@/components/global/GenericPagination";
import { Modal } from "@/components/global/Modal";
import { Button } from "@/components/ui/button";
import {
  cancelAppointment,
  completeAppointment,
} from "@/lib/appointment/service";
import { ConfirmationModal } from "@/components/global/Confirmation-modal";
import AppointmentListSkeleton from "./Skeleton/AppointmentListSkeleton";

interface ClientAppointmentListProps {
  token: string;
  clientRuc: string;
}

const ClientAppointmentList = ({
  token,
  clientRuc,
}: ClientAppointmentListProps) => {
  const [filters, setFilters] = useState<AppointmentQueryParams>({
    page: 1,
    clientRuc,
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentData | null>(null);
  const [modalAction, setModalAction] = useState<"complete" | "cancel" | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelDescription, setCancelDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data, error, pagination, fetchData, refresh } =
    usePaginatedFetch<AppointmentData>(APPOINTMENT_API, token, {
      initialPage: 1,
      size: 10,
      autoFetch: false,
    });

  useEffect(() => {
    setIsLoading(true);
    setIsRefreshing(true);
    fetchData(filters.page || 1, { search: clientRuc }).finally(() => {
      setIsLoading(false);
      setIsRefreshing(false);
    });
  }, [filters.page, clientRuc]);

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
  };

  const openConfirmModal = (
    appointment: AppointmentData,
    action: "complete" | "cancel"
  ) => {
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

    if (modalAction === "cancel" && cancelDescription.length < 12) {
      toast(
        "error",
        "El motivo de la cancelación debe tener al menos 12 caracteres"
      );
      return;
    }

    try {
      setIsProcessing(true);
      setIsRefreshing(true);
      if (modalAction === "complete") {
        await completeAppointment(selectedAppointment.id, token);
      } else {
        await cancelAppointment(
          selectedAppointment.id,
          token,
          cancelDescription
        );
      }

      toast(
        "success",
        `Cita ${
          modalAction === "complete" ? "finalizada" : "cancelada"
        } con éxito`
      );
      await fetchData(filters.page || 1, { clientRuc });
    } catch (error) {
      toast("error", "Ocurrió un error al actualizar la cita");
    } finally {
      setIsProcessing(false);
      setIsRefreshing(false);
      setIsModalOpen(false);
      setCancelModalOpen(false);
      setSelectedAppointment(null);
      setModalAction(null);
      setCancelDescription("");
    }
  };

  if (error) {
    toast("error", error.message || "Error al cargar las citas");
  }

  return (
    <div className="p-4 space-y-4">
      {isLoading ? (
        <AppointmentListSkeleton />
      ) : data?.length ? (
        <div className="grid grid-cols-1 gap-4">
          {data.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              token={token}
              onChange={refresh}
              isProcessing={isProcessing || isRefreshing}
              setIsProcessing={setIsProcessing}
              onOpenModal={(appt, action) => openConfirmModal(appt, action)}
            />
          ))}
        </div>
      ) : (
        <p>No se encontraron citas.</p>
      )}

      <GenericPagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        handlePreviousPage={() => {
          if (pagination.currentPage > 1) {
            handlePageChange(pagination.currentPage - 1);
          }
        }}
        handleNextPage={() => {
          if (pagination.currentPage < pagination.totalPages) {
            handlePageChange(pagination.currentPage + 1);
          }
        }}
        handlePageChange={handlePageChange}
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

export default ClientAppointmentList;
