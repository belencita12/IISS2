"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { appointmentSchema } from "@/lib/appointment/appointmentSchema";
import { AppointmentRegister, ServiceType } from "@/lib/appointment/IAppointment";
import { EmployeeData } from "@/lib/employee/IEmployee";
import { PetData } from "@/lib/pets/IPet";
import { createAppointment } from "@/lib/appointment/service";
import { toast } from "@/lib/toast";
import { Button } from "@/components/ui/button";
import PetSelect from "./PetSelect";
import PetSelected from "./PetSelected";
import ServiceSelect from "@/components/admin/appointment/register/ServiceSelect";
import ServiceSelected from "@/components/admin/appointment/register/ServiceSelected";
import EmployeeSelect from "./EmployeeSelect";
import EmployeeSelected from "@/components/admin/appointment/register/EmployeeSelected";
import { AvailabilityPicker } from "@/components/admin/appointment/register/AvailabilityPicker";

type AppointmentFormProps = {
  token: string;
  clientId: number;
  userRole: string;
};

export const AppointmentForm = ({ token, clientId, userRole}: AppointmentFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<AppointmentRegister>({
    resolver: zodResolver(appointmentSchema),
  });

  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeData | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null);
  const [selectedPet, setSelectedPet] = useState<PetData | null>(null);

  const selectedDate = watch("designatedDate");
  const formattedDate = typeof selectedDate === "string" && selectedDate.trim() !== "" ? selectedDate.trim() : null;

  const onSubmit = async (data: AppointmentRegister) => {
    setIsSubmitting(true);
    try {
      await createAppointment(token, data);
      toast("success", "Cita registrada con éxito");
      router.push("/user-profile");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Error al registrar la cita";
      toast("error", errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectEmployee = (employee: EmployeeData) => {
    if (employee.id) {
      setValue("employeesId", [employee.id]);
      setSelectedEmployee(employee);
    }
  };

  const handleSelectService = (service: ServiceType) => {
    if (service.id) {
      setValue("serviceId", service.id);
      setSelectedService(service);
    }
  };

  const handleSelectPet = (pet: PetData) => {
    if (pet.id) {
      setValue("petId", pet.id);
      setSelectedPet(pet);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-screen-xl px-6 py-10 md:px-20 lg:px-32 space-y-12 text-lg"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Seleccionar Mascota</label>
          <PetSelect clientId={clientId} token={token}  onSelectPet={handleSelectPet} />
          <input type="hidden" {...register("petId")} />
          {errors.petId && <p className="text-red-500 text-sm mt-1">{errors.petId.message}</p>}
          {selectedPet && <PetSelected pet={selectedPet} />}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Seleccionar Servicio</label>
          <ServiceSelect token={token} userRole={userRole} onSelectService={handleSelectService} />
          <input type="hidden" {...register("serviceId")} />
          {errors.serviceId && <p className="text-red-500 text-sm mt-1">{errors.serviceId.message}</p>}
          {selectedService && <ServiceSelected service={selectedService} />}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Seleccionar Empleado</label>
          <EmployeeSelect token={token}  onSelectEmployee={handleSelectEmployee} />
          <input type="hidden" {...register("employeesId")} />
          {errors.employeesId && <p className="text-red-500 text-sm mt-1">{errors.employeesId.message}</p>}
          {selectedEmployee && <EmployeeSelected employee={selectedEmployee} />}
        </div>

        <div className="md:col-span-2 flex flex-col md:flex-row gap-6">
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700">Fecha</label>
            <input
              type="date"
              {...register("designatedDate")}
              className="w-full border border-gray-300 rounded-md p-2"
              min={new Date().toISOString().split("T")[0]}
            />
            {errors.designatedDate && (
              <p className="text-red-500 text-sm mt-1">{errors.designatedDate.message}</p>
            )}

            <div className="w-full mt-4">
              {selectedEmployee && formattedDate && (
                <AvailabilityPicker
                  token={token}
                  employeeId={String(selectedEmployee.id)}
                  date={formattedDate}
                  serviceDuration={selectedService?.durationMin || 0}
                  onSelectTime={(time) => setValue("designatedTime", time)}
                />
              )}

              {errors.designatedTime && (
                <p className="text-red-500 text-sm mt-1">{errors.designatedTime.message}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Detalles</label>
        <textarea
          {...register("details")}
          className="w-full border border-gray-300 rounded-md p-2"
          rows={4}
        />
      </div>

      <div className="flex justify-center gap-4 mt-4">
        <Button
          type="button"
          variant="outline"
          className="bg-white text-black hover:bg-slate-50"
          onClick={() => router.push("/user-profile")}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          className="bg-black text-white hover:bg-gray-800"
          disabled={!selectedEmployee || !selectedService || !selectedPet || !formattedDate || isSubmitting}
        >
          {isSubmitting ? "Registrando..." : "Registrar Cita"}
        </Button>
      </div>
    </form>
  );
};
