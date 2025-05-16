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
import PetSearch from "./PetSearch";
import PetSelected from "./PetSelected";
import ServiceSelect from "./ServiceSelect";
import ServiceSelected from "./ServiceSelected";
import EmployeeSelect from "./EmployeeSelect";
import EmployeeSelected from "./EmployeeSelected";
import { AvailabilityPicker } from "./AvailabilityPicker";

type AppointmentFormProps = {
  token: string;
};

export const AppointmentForm = ({ token }: AppointmentFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<AppointmentRegister>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      serviceIds: [], // Initialize with empty array for multiple services
    }
  });

  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeData | null>(null);
  const [selectedServices, setSelectedServices] = useState<ServiceType[]>([]); // Changed to array for multiple services
  const [selectedPet, setSelectedPet] = useState<PetData | null>(null);

  const selectedDate = watch("designatedDate");
  const formattedDate = typeof selectedDate === "string" && selectedDate.trim() !== "" ? selectedDate.trim() : null;
  const selectedServiceIds = watch("serviceIds"); // Watch the serviceIds array

  const onSubmit = async (data: AppointmentRegister) => {
    setIsSubmitting(true);
    try {
      await createAppointment(token, data);
      toast("success", "Cita registrada con éxito");
      router.push("/dashboard/appointment");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Error al registrar la cita";
      toast("error", errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectEmployee = (employee: EmployeeData) => {
    if (employee.id) {
      setValue("employeeId", employee.id); // Updated to match schema
      setSelectedEmployee(employee);
    }
  };

  // Updated to handle multiple services
  const handleSelectServices = (services: ServiceType[]) => {
    if (services.length > 0) {
      const serviceIds = services.map(service => service.id).filter(id => id !== undefined) as number[];
      setValue("serviceIds", serviceIds);
      setSelectedServices(services);
    } else {
      setValue("serviceIds", []);
      setSelectedServices([]);
    }
  };

  const handleSelectPet = (pet: PetData) => {
    if (pet.id) {
      setValue("petId", pet.id);
      setSelectedPet(pet);
    }
  };

  // Calculate total duration for availability
  const getTotalServiceDuration = () => {
    return selectedServices.reduce((total, service) => total + (service.durationMin || 0), 0);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full min-h-screen px-6 py-10 md:px-20 lg:px-32 space-y-10"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Seleccionar Mascota</label>
          <PetSearch token={token} onSelectPet={handleSelectPet} />
          <input type="hidden" {...register("petId")} />
          {errors.petId && <p className="text-red-500 text-sm mt-1">{errors.petId.message}</p>}
          {selectedPet && <PetSelected pet={selectedPet} />}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Seleccionar Servicios</label>
          <ServiceSelect 
            token={token} 
            onSelectServices={handleSelectServices} 
            selectedServices={selectedServices}
          />
          {/* Hidden input is not needed as we'll set serviceIds directly */}
          {errors.serviceIds && <p className="text-red-500 text-sm mt-1">{errors.serviceIds.message}</p>}
          {selectedServices.length > 0 && (
            <div className="mt-2">
              {selectedServices.map(service => (
                <ServiceSelected key={service.id} service={service} />
              ))}
            </div>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Seleccionar Empleado</label>
          <EmployeeSelect token={token} onSelectEmployee={handleSelectEmployee} />
          <input type="hidden" {...register("employeeId")} />
          {errors.employeeId && <p className="text-red-500 text-sm mt-1">{errors.employeeId.message}</p>}
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
              {selectedEmployee && formattedDate && selectedServices.length > 0 && (
                <AvailabilityPicker
                  token={token}
                  employeeId={String(selectedEmployee.id)}
                  date={formattedDate}
                  serviceDuration={getTotalServiceDuration()} // Use total duration of all services
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
          onClick={() => router.push("/dashboard/appointment")}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          className="bg-black text-white hover:bg-gray-800"
          disabled={!selectedEmployee || selectedServices.length === 0 || !selectedPet || !formattedDate || isSubmitting}
        >
          {isSubmitting ? "Registrando..." : "Registrar Cita"}
        </Button>
      </div>
    </form>
  );
};