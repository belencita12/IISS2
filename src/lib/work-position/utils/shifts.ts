import { Shift } from "@/lib/work-position/IPosition";
import { toast } from "@/lib/toast";

export const DEFAULT_SHIFT: Shift = { weekDay: -1, startTime: "08:00", endTime: "12:00" };
export const DAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

// Verifica si algún turno es igual al predeterminado
export const areDefaultShifts = (shifts: Shift[]): boolean =>
    shifts.some(({ weekDay, startTime, endTime }) =>
        weekDay === DEFAULT_SHIFT.weekDay &&
        startTime === DEFAULT_SHIFT.startTime &&
        endTime === DEFAULT_SHIFT.endTime
    );

// Retorna el texto correspondiente para los días seleccionados
export const getDayText = (weekDay: number | number[]): string => {
    if (typeof weekDay === "number") {
        return weekDay === DEFAULT_SHIFT.weekDay ? "Seleccionar día" : DAYS[weekDay] || "Día";
    }
    if (Array.isArray(weekDay)) {
        if (weekDay.length === 5 && weekDay.every((day, i) => day === i)) return "Lunes a Viernes";
        if (weekDay.length === 6 && weekDay.every((day, i) => day === i)) return "Lunes a Sábado";
        return getDayText(weekDay[0]);
    }
    return "Día";
};

// Devuelve el valor para un día o un conjunto de días
export const getDayValue = (weekDay: number | number[]): string => {
    if (typeof weekDay === "number") {
        return weekDay === DEFAULT_SHIFT.weekDay ? "" : String(weekDay);
    }
    if (Array.isArray(weekDay)) {
        if (weekDay.length === 5 && weekDay.every((day, i) => day === i)) return "weekdays";
        if (weekDay.length === 6 && weekDay.every((day, i) => day === i)) return "weekdays_saturday";
        if (weekDay.length === 7 && weekDay.every((day, i) => day === i)) return "fullweek";
        return String(weekDay[0]);
    }
    return "";
};

// Obtiene los días disponibles para asignar un turno, excluyendo los seleccionados
export const getAvailableDays = (shifts: (Shift | { weekDay: number | number[] })[], currentIndex: number): number[] => {
    const selectedDays = new Set(
        shifts.flatMap((shift, i) =>
            i === currentIndex ? [] : Array.isArray(shift.weekDay) ? shift.weekDay : [shift.weekDay]
        )
    );
    return [0, 1, 2, 3, 4, 5, 6].filter(day => !selectedDays.has(day));
};
// Compara dos tiempos en formato "HH:mm"
export const isTimeBefore = (time1: string, time2: string) => {
    const [h1, m1] = time1.split(":").map(Number);
    const [h2, m2] = time2.split(":").map(Number);
    return h1 < h2 || (h1 === h2 && m1 < m2);
};

// Valida la selección de días y evita conflictos
export const validateShifts = (value: string, currentShifts: any[], index: number): number | number[] | undefined => {
    const mappings: Record<string, number[]> = {
        weekdays: [0, 1, 2, 3, 4], weekdays_saturday: [0, 1, 2, 3, 4, 5], fullweek: [0, 1, 2, 3, 4, 5, 6],
    };
    const newWeekDay = mappings[value] ?? Number(value);
    const selectedDays = currentShifts.flatMap((shift, i) =>
        i === index ? [] : Array.isArray(shift.weekDay) ? shift.weekDay : [shift.weekDay]
    );
    const conflictDay = Array.isArray(newWeekDay)
        ? newWeekDay.find((day) => selectedDays.includes(day))
        : selectedDays.includes(newWeekDay)
            ? newWeekDay
            : undefined;

    if (conflictDay !== undefined) {
        toast("error", `El día ${getDayText(conflictDay)} ya tiene un horario`);
        return undefined;
    }
    return newWeekDay;
};
