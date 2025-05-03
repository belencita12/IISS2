"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { appointmentSchema } from "@/lib/appointment/appointmentSchema";
import { AppointmentRegister } from "@/lib/appointment/IAppointment";
import { createAppointment } from "@/lib/appointment/service";
import { toast } from "@/lib/toast";
import  EmployeeSelect  from "./EmployeeSelect"; // Importa el nuevo componente
import { EmployeeData } from "@/lib/employee/IEmployee";

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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label>Fecha</label>
        <input type="date" {...register("designatedDate")} className="input" />
        {errors.designatedDate && <p className="text-red-500">{errors.designatedDate.message}</p>}
      </div>

      <div>
        <label>Hora</label>
        <input type="time" {...register("designatedTime")} className="input" />
        {errors.designatedTime && <p className="text-red-500">{errors.designatedTime.message}</p>}
      </div>

      <div>
        <label>Detalles</label>
        <textarea {...register("details")} className="textarea" />
      </div>




      <div>
        <label>Empleado</label>
        <EmployeeSelect
          token={token}
          onSelectEmployee={handleSelectEmployee} // Usamos el callback para establecer el empleado
        />
        {errors.employeesId && <p className="text-red-500">{errors.employeesId.message}</p>}
      </div>

      <button type="submit" className="btn btn-primary">
        Registrar Cita
      </button>
    </form>
  );
};
