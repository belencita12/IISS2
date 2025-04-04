import { z } from "zod";
import { Purchase } from "./IPurchase";

export const purchaseSchema: z.ZodType<Purchase> = z.object({
  providerId: z.number().min(1, "Proveedor es obligatorio"),
  stockId: z.number().min(1, "Sucursal es obligatoria"),
  date: z.string().min(1, "Fecha es obligatoria"),
  details: z
    .array(
      z.object({
        productId: z.number().min(1, "Producto inválido"),
        quantity: z.number().min(1, "Cantidad debe ser mayor a 0"),
      })
    )
    .min(1, "Debes agregar al menos un producto"),
});
