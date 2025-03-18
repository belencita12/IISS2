import { z } from "zod";

export const positionSchema = z.object({
    name: z.string().min(1, "El nombre es obligatorio"),
    shifts: z.array(
        z.object({
            weekDay: z.union([
                z.number().min(0, { message: "Elige un día de la semana" }).max(6, { message: "Elige un día de la semana" }),
                z.array(z.number().min(0, { message: "Elige un día de la semana" }).max(6, { message: "Elige un día de la semana" })).min(0, { message: "Elige un día de la semana" })
            ]),
            startTime: z.string(),
            endTime: z.string()
        }).refine(
            ({ startTime, endTime }) => startTime < endTime,
            { message: "La hora de finalización debe ser posterior a la de inicio", path: ["endTime"] }
        )
    ).min(1, "Debe agregar al menos un horario")
});
