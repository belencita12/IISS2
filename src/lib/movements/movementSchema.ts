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

        .min(1, "Depósito de origen es obligatorio"),
    destinationStockId: z   
    
            .number({ required_error: "Depósito de destino es obligatorio" })
            .min(1, "Depósito de destino es obligatorio"),

    managerId: z
        .number({ required_error: "Responsable es obligatorio" })
        .min(1, "Responsable es obligatorio"),


  details: z
    .array(
      z.object({
        productId: z.number().min(1, "Producto inválido"),
        quantity: z.number().min(1, "Cantidad debe ser mayor a 0"),
      })
    )
    .min(1, "Debes agregar al menos un producto"),
});
