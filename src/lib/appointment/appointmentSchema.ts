import { z } from "zod";
import { AppointmentRegister } from "./IAppointment";

export const appointmentSchema: z.ZodType<AppointmentRegister> = z.object({
  designatedDate: z.string().min(1, "La fecha es obligatoria"),
  designatedTime: z.string().min(1, "La hora es obligatoria"),
  details: z.string().optional(),
  serviceIds: z
    .array(z.number().positive())
    .min(1, "Debes seleccionar al menos un servicio"),
  petId: z
    .number({
      required_error: "La mascota es obligatoria",
    })
    .min(1, "La mascota es obligatoria"),
  employeeId: z.number(),
});