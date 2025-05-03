"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { appointmentSchema } from "@/lib/appointment/appointmentSchema";
import { AppointmentRegister } from "@/lib/appointment/IAppointment";
import { createAppointment } from "@/lib/appointment/service";
import { toast } from "@/lib/toast";
import  EmployeeSelect  from "./EmployeeSelect"; // Importa el nuevo componente
import { EmployeeData } from "@/lib/employee/IEmployee";
import ServiceSelect from "./ServiceSelect";
import { ServiceType } from "@/lib/appointment/IAppointment";
import PetSearch from "./PetSearch";
import { PetData } from "@/lib/pets/IPet";

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
  } = useForm<AppointmentRegister>({
    resolver: zodResolver(appointmentSchema),
  });

  const onSubmit = async (data: AppointmentRegister) => {
    try {
      await createAppointment(token, data);
      toast("success", "Cita registrada con éxito");
      reset();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Error al registrar la cita";
      toast("error", errorMessage);
    }
  };

  // Modificado para aceptar un EmployeeData (con id opcional)
  const handleSelectEmployee = (employee: EmployeeData) => {
    // Si el empleado tiene un ID, lo asignamos
    if (employee.id) {
      setValue("employeesId", [employee.id]);
    }
  };

  const handleSelectService = (service: ServiceType) => {
    // Si el servicio tiene un ID, lo asignamos
    if (service.id) {
      setValue("serviceId", service.id);
    }
  }

  const handleSelectPet = (pet: PetData) => {
    // Si la mascota tiene un ID, lo asignamos
    if (pet.id) {
      setValue("petId", pet.id);
    }
  };


  return (
    <form
  onSubmit={handleSubmit(onSubmit)}
  className="w-full min-h-screen px-6 py-10 md:px-20 lg:px-32 space-y-10"
>

  {/* Fecha y hora */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Mascota */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Seleccionar Mascota</label>
    <PetSearch token={token} onSelectPet={handleSelectPet} />
    <input type="hidden" {...register("petId")} />
    {errors.petId && <p className="text-red-500 text-sm mt-1">{errors.petId.message}</p>}
  </div>

    {/* Servicio */}
    <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Seleccionar Servicio</label>
    <ServiceSelect token={token} onSelectService={handleSelectService} />
    <input type="hidden" {...register("serviceId")} />
    {errors.serviceId && <p className="text-red-500 text-sm mt-1">{errors.serviceId.message}</p>}
  </div>

    {/* Empleado */}
  <div className="md:col-span-2">
    <label className="block text-sm font-medium text-gray-700 mb-1">Seleccionar Empleado</label>
    <EmployeeSelect token={token} onSelectEmployee={handleSelectEmployee} />
    <input type="hidden" {...register("employeesId")} />
    {errors.employeesId && <p className="text-red-500 text-sm mt-1">{errors.employeesId.message}</p>}
  </div>

  <div className="md:col-span-2 flex flex-col md:flex-row gap-6">
  <div className="w-full">
    <label className="block text-sm font-medium text-gray-700">Fecha</label>
    <input
      type="date"
      {...register("designatedDate")}
      className="w-full border border-gray-300 rounded-md p-2"
    />
    {errors.designatedDate && (
      <p className="text-red-500 text-sm mt-1">{errors.designatedDate.message}</p>
    )}
  </div>

  <div className="w-full">
    <label className="block text-sm font-medium text-gray-700">Hora</label>
    <input
      type="time"
      {...register("designatedTime")}
      className="w-full border border-gray-300 rounded-md p-2"
    />
    {errors.designatedTime && (
      <p className="text-red-500 text-sm mt-1">{errors.designatedTime.message}</p>
    )}
  </div>
</div>
</div>

  {/* Detalles */}
  <div>
    <label className="block text-sm font-medium text-gray-700">Detalles</label>
    <textarea
      {...register("details")}
      className="w-full border border-gray-300 rounded-md p-2"
      rows={4}
    />
  </div>



  {/* Botón */}
  <div className="flex justify-center">
    <button
      type="submit"
      className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition"
    >
      Registrar Cita
    </button>
  </div>
</form>


  );
};
