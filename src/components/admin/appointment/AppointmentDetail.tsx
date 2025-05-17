"use client";

import { useEffect, useState } from "react";
import { useFetch } from "@/hooks/api/useFetch";
import { AppointmentData, AppointmentStatus } from "@/lib/appointment/IAppointment";
import { APPOINTMENT_API } from "@/lib/urls";
import { toast } from "@/lib/toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { completeAppointment, cancelAppointment } from "@/lib/appointment/service";
import { ConfirmationModal } from "@/components/global/Confirmation-modal";
import { Modal } from "@/components/global/Modal";
import { formatDate } from "@/lib/utils";

const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-800 border-yellow-300",
  IN_PROGRESS: "bg-blue-100 text-blue-800 border-blue-300",
  COMPLETED: "bg-green-100 text-green-800 border-green-300",
  CANCELLED: "bg-red-100 text-red-800 border-red-300",
};

const statusLabels = {
  PENDING: "Pendiente",
  IN_PROGRESS: "En Progreso",
  COMPLETED: "Completada",
  CANCELLED: "Cancelada",
};

interface AppointmentDetailProps {
  token: string | null;
  appointmentId: string;
}

const AppointmentDetail = ({ token, appointmentId }: AppointmentDetailProps) => {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelDescription, setCancelDescription] = useState("");
  const [modalAction, setModalAction] = useState<"complete" | "cancel" | null>(null);

  const {
    data: appointment,
    loading,
    error,
    execute: fetchAppointment,
  } = useFetch<AppointmentData>(
    `${APPOINTMENT_API}/${appointmentId}`,
    token,
    { immediate: true }
  );

  useEffect(() => {
    if (error) {
      toast("error", error.message || "Error al cargar la cita");
    }
  }, [error]);

  const openConfirmModal = (action: "complete" | "cancel") => {
    if (action === "complete" && appointment) {
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
    setModalAction(action);
    if (action === "cancel") {
      setCancelModalOpen(true);
    } else {
      setIsModalOpen(true);
    }
  };

  const handleConfirmAction = async () => {
    if (!appointment || !modalAction) return;

    try {
      setIsProcessing(true);
      if (modalAction === "complete") {
        await completeAppointment(appointment.id, token || "");
      } else {
        await cancelAppointment(appointment.id, token || "", cancelDescription);
      }
      toast("success", `Cita ${modalAction === "complete" ? "finalizada" : "cancelada"} con éxito`);
      fetchAppointment();
    } catch (error) {
      toast("error", "Ocurrió un error al actualizar la cita");
    } finally {
      setIsProcessing(false);
      setIsModalOpen(false);
      setCancelModalOpen(false);
      setModalAction(null);
      setCancelDescription("");
    }
  };

  const canBeCompleted = appointment?.status === "PENDING" || appointment?.status === "IN_PROGRESS";
  const canBeCancelled = appointment?.status === "PENDING";

  if (loading) {
    return <AppointmentDetailSkeleton />;
  }

  if (!appointment && !loading) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-semibold mb-4">Cita no encontrada</h2>
        <Button onClick={() => router.push("/dashboard/appointment")}>
          Volver a citas
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Detalle de la Cita</h1>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={() => router.push("/dashboard/appointment")}
          >
            Volver
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Información General</h2>
            <div className="mt-2 space-y-2">
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">ID de Cita</span>
                <span>{appointment?.id}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Estado</span>
                <Badge className={`${statusColors[appointment?.status || "PENDING"]} w-fit`}>
                  {statusLabels[appointment?.status || "PENDING"]}
                </Badge>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Fecha Designada</span>
                <span>{formatDate(appointment?.designatedDate || "")}</span>
              </div>
              {appointment?.completedDate && (
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Fecha de Finalización</span>
                  <span>{formatDate(appointment?.completedDate)}</span>
                </div>
              )}
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Servicio</span>
                <span>{appointment?.service}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold">Detalles</h2>
            <p className="mt-2 text-gray-700">
              {appointment?.details || "Sin detalles adicionales"}
            </p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Datos de la Mascota</h2>
            <div className="mt-2 space-y-2">
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Nombre</span>
                <span>{appointment?.pet.name}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Raza</span>
                <span>{appointment?.pet.race}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold">Datos del Dueño</h2>
            <div className="mt-2 space-y-2">
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">ID</span>
                <span>{appointment?.pet.owner.id}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Nombre</span>
                <span>{appointment?.pet.owner.name}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Empleados Asignados</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {appointment?.employees && appointment.employees.length > 0 ? (
            appointment.employees.map((employee) => (
              <div key={employee.id} className="bg-gray-50 p-3 rounded-md">
                <p className="font-medium">{employee.name}</p>
                <p className="text-sm text-gray-500">ID: {employee.id}</p>
              </div>
            ))
          ) : (
            <p>No hay empleados asignados</p>
          )}
        </div>
      </div>
      
      <div className="border-t pt-6 flex justify-end space-x-3">
        {canBeCompleted && (
          <Button 
            variant="default" 
            onClick={() => openConfirmModal("complete")}
            disabled={isProcessing}
          >
            Finalizar Cita
          </Button>
        )}
        
        {canBeCancelled && (
          <Button 
            variant="destructive" 
            onClick={() => openConfirmModal("cancel")}
            disabled={isProcessing}
          >
            Cancelar Cita
          </Button>
        )}
      </div>

      {/* Complete Confirmation Modal */}
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

      {/* Cancel Modal with description */}
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
            variant="outline"
            onClick={() => setCancelModalOpen(false)}
            disabled={isProcessing}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirmAction}
            disabled={isProcessing || !cancelDescription.trim()}
          >
            {isProcessing ? "Cancelando..." : "Confirmar"}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

const AppointmentDetailSkeleton = () => {
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-10 w-24" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-4">
          <div>
            <Skeleton className="h-8 w-48 mb-4" />
            <div className="mt-2 space-y-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
            </div>
          </div>
          
          <div>
            <Skeleton className="h-8 w-48 mb-4" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <Skeleton className="h-8 w-48 mb-4" />
            <div className="mt-2 space-y-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
            </div>
          </div>
          
          <div>
            <Skeleton className="h-8 w-48 mb-4" />
            <div className="mt-2 space-y-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <Skeleton className="h-8 w-48 mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
      
      <div className="border-t pt-6 flex justify-end space-x-3">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  );
};

export default AppointmentDetail;