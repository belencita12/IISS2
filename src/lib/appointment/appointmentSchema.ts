import { z } from "zod";
import { AppointmentRegister } from "./IAppointment";

export const appointmentSchema: z.ZodType<AppointmentRegister> = z.object({
  designatedDate: z.string().min(1, "La fecha es obligatoria"),
  designatedTime: z.string().min(1, "La hora es obligatoria"),
  details: z.string().optional(),
  serviceId: z
    .number({
      required_error: "El servicio es obligatorio",
    })
    .min(1, "El servicio es obligatorio"),
  petId: z
    .number({
      required_error: "La mascota es obligatoria",
    })
    .min(1, "La mascota es obligatoria"),
  employeesId: z.array(z.number()).nonempty("Seleccione a un empleado"),
});