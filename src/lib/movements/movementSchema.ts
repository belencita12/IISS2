import { z } from "zod";
import { Movement } from "./IMovements";

export const movementSchema: z.ZodType<Movement> = z.object({
    id: z.number().optional(),

    type: z.enum(["INBOUND", "OUTBOUND", "TRANSFER"], {

        required_error: "Tipo de movimiento es obligatorio",
        }),

    description: z.string().optional(),

    dateMovement: z.string().min(1, "Fecha es obligatoria"),

    originStockId: z
    .number({ required_error: "Depósito de origen es obligatorio" })
    .min(1, "Depósito de origen es obligatorio")
    .optional(), // se valida condicionalmente

  destinationStockId: z
    .number({ required_error: "Depósito de destino es obligatorio" })
    .min(1, "Depósito de destino es obligatorio")
    .optional(), // se valida condicionalmente


    managerId: z
        .number({ required_error: "Empleado es obligatorio" })
        .min(1, "Empleado es obligatorio"),


  details: z
    .array(
      z.object({
        productId: z.number().min(1, "Producto inválido"),
        quantity: z.number().min(1, "Cantidad debe ser mayor a 0"),
      })
    )
    .min(1, "Debes agregar al menos un producto"),
})
.refine((data) => {
  if (data.type === "INBOUND") return data.destinationStockId !== undefined;
  if (data.type === "OUTBOUND") return data.originStockId !== undefined;
  if (data.type === "TRANSFER") return data.originStockId !== undefined && data.destinationStockId !== undefined;
  return true;
}, {
  message: "Los campos de origen y destino no son válidos según el tipo de movimiento",
});
