import {z} from "zod";
import { AppointmentRegister } from "./IAppointment"; 

export const appointmentSchema: z.ZodType<AppointmentRegister> = z.object({
    designatedDate: z.string().min(1, "Fecha es obligatoria"),
    designatedTime: z.string().min(1, "Hora es obligatoria"),
    details: z.string().optional(),
    serviceId: z
        .number({
        required_error: "Servicio es obligatorio",
        })
        .min(1, "Servicio es obligatorio"),
    petId: z
        .number({
        required_error: "Mascota es obligatoria",
        })
        .min(1, "Mascota es obligatoria"),
    employeesId: z
        .array(z.number())
        .nonempty("Debes seleccionar al menos un empleado"),
    });
    

