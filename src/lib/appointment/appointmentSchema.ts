import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Updated appointment schema to match the new backend structure
export const appointmentSchema = z.object({
  designatedDate: z.string({
    required_error: "La fecha es requerida",
  }),
  designatedTime: z.string({
    required_error: "La hora es requerida",
  }),
  details: z.string().optional(),
  serviceIds: z.array(z.number()).min(1, "Debe seleccionar al menos un servicio"),
  petId: z.number({
    required_error: "Debe seleccionar una mascota",
    invalid_type_error: "ID de mascota inválido",
  }),
  employeeId: z.number({
    required_error: "Debe seleccionar un empleado",
    invalid_type_error: "ID de empleado inválido",
  }),
});