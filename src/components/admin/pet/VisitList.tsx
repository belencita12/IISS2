"use client";

import { useState } from "react";
import { usePaginatedFetch } from "@/hooks/api/usePaginatedFetch";
import { APPOINTMENT_API } from "@/lib/urls";
import {
  AppointmentData,
  AppointmentQueryParams,
} from "@/lib/appointment/IAppointment";
import AppointmentCard from "@/components/admin/appointment/AppointmentCard";
import AppointmentDateFilter from "@/components/admin/appointment/filters/AppointmentDateFilter";
import AppointmentStatusFilter from "@/components/admin/appointment/filters/AppointmentStatusFilter";
import GenericPagination from "@/components/global/GenericPagination";
import { completeAppointment, cancelAppointment } from "@/lib/appointment/service";
import { ConfirmationModal } from "@/components/global/Confirmation-modal";
import { Modal } from "@/components/global/Modal";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "@/lib/toast";
import { useTranslations } from "next-intl";

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

  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentData | null>(null);
  const [modalAction, setModalAction] = useState<"complete" | "cancel" | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelDescription, setCancelDescription] = useState("");

  const a = useTranslations("AppointmentTable");
  const e = useTranslations("Error");
  const b = useTranslations("Button");
  const m = useTranslations("ModalConfirmation");

  const {
    data: appointments,
    loading,
    error,
    pagination = { currentPage: 1, totalPages: 1, totalItems: 0, pageSize: 3 },
    setPage,
    search,
    refresh,
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
    search({ ...safeFilters });
  };

  const openConfirmModal = (appointment: AppointmentData, action: "complete" | "cancel") => {
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
    } catch (error:unknown) {
      toast("error", error instanceof Error ? error.message : e("errorLoad", {field: "cita"}));
    } finally {
      setIsProcessing(false);
      setIsModalOpen(false);
      setCancelModalOpen(false);
      setSelectedAppointment(null);
      setModalAction(null);
      setCancelDescription("");
    }
  };

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="flex flex-col gap-4">
        <div className="w-full">
          <AppointmentDateFilter filters={filters} setFilters={handleFilterChange} />
        </div>
        <div className="w-full">
          <AppointmentStatusFilter filters={filters} setFilters={handleFilterChange} />
        </div>
      </div>

      {/* Lista */}
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
          <span className="ml-2 text-gray-600">{b("loading")}</span>
        </div>
      ) : error ? (
        <p className="text-center text-red-500">{e("errorLoad", {field: "citas"})}</p>
      ) : appointments.length === 0 ? (
        <p className="text-center text-gray-600">
          {a("noVisits")}
        </p>
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              token={token}
              onOpenModal={openConfirmModal}
              isProcessing={isProcessing}
              setIsProcessing={setIsProcessing}
            />
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

      {/* Modal Confirmar Finalización */}
      {selectedAppointment && modalAction === "complete" && (
        <ConfirmationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleConfirmAction}
          title={m("titleFinish", {field: "cita"})}
          message={m("confirmFinish", {field: "cita"})}
          confirmText={b("confirm")}
          cancelText={b("cancel")}
          isLoading={isProcessing}
        />
      )}

      {/* Modal Cancelación */}
      {selectedAppointment && modalAction === "cancel" && (
        <Modal
          isOpen={cancelModalOpen}
          onClose={() => setCancelModalOpen(false)}
          title={m("motivo")}
          size="md"
        >
          <textarea
            className="w-full h-32 p-2 border border-gray-300 rounded"
            placeholder={m("reason")}
            value={cancelDescription}
            onChange={(e) => setCancelDescription(e.target.value)}
          />
          <div className="flex justify-end mt-4 gap-2">
            <Button
              className="bg-white text-black px-4 py-2 rounded border hover:bg-gray-100"
              onClick={() => setCancelModalOpen(false)}
              disabled={isProcessing}
            >
              {b("cancel")}
            </Button>
            <Button
              className="bg-red-600 text-white px-4 py-2 rounded border hover:bg-red-700"
              onClick={handleConfirmAction}
              disabled={isProcessing || !cancelDescription.trim()}
            >
              {isProcessing ? b("canceling") : b("confirm")}
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
