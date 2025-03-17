import { z } from "zod";

export const positionSchema = z.object({
    name: z.string().min(1, "El nombre es obligatorio"),
    shifts: z.array(
        z.object({
            weekDay: z.union([
                z.number().min(1).max(7),
                z.array(z.number().min(1).max(7)).min(1)
            ]),
            startTime: z.string(),
            endTime: z.string()
        })
    ).min(1, "Debe agregar al menos un horario")
});
