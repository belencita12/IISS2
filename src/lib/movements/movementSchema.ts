import { z } from "zod";
import { Movement } from "./IMovements";
export const movementSchema: z.ZodType<Movement> = z
  .object({
    id: z.number().optional(),

    type: z.enum(["INBOUND", "OUTBOUND", "TRANSFER"], {
      required_error: "Tipo de movimiento es obligatorio",
    }),

    description: z.string().optional(),

    dateMovement: z.string().min(1, "Fecha es obligatoria"),

    originStockId: z.number().optional(),
    destinationStockId: z.number().optional(),

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
  .superRefine((data, ctx) => {
    if (data.type === "INBOUND" && !data.destinationStockId) {
      ctx.addIssue({
        path: ["destinationStockId"],
        code: z.ZodIssueCode.custom,
        message: "Depósito de destino es obligatorio para ingreso",
      });
    }

    if (data.type === "OUTBOUND" && !data.originStockId) {
      ctx.addIssue({
        path: ["originStockId"],
        code: z.ZodIssueCode.custom,
        message: "Depósito de origen es obligatorio para egreso",
      });
    }

    if (
      data.type === "TRANSFER" &&
      (!data.originStockId || !data.destinationStockId)
    ) {
      if (!data.originStockId) {
        ctx.addIssue({
          path: ["originStockId"],
          code: z.ZodIssueCode.custom,
          message: "Depósito de origen es obligatorio para transferencia",
        });
      }
      if (!data.destinationStockId) {
        ctx.addIssue({
          path: ["destinationStockId"],
          code: z.ZodIssueCode.custom,
          message: "Depósito de destino es obligatorio para transferencia",
        });
      }
    }
  });
