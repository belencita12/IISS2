import { Shift } from "@/lib/work-position/IPosition";

export const DEFAULT_SHIFT: Shift = { weekDay: -1, startTime: "08:00", endTime: "12:00" };

export const DAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

export const areDefaultShifts = (shifts: Shift[]): boolean =>
    shifts.some(
        ({ weekDay, startTime, endTime }) =>
            weekDay === DEFAULT_SHIFT.weekDay &&
            startTime === DEFAULT_SHIFT.startTime &&
            endTime === DEFAULT_SHIFT.endTime
    );

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

export const getAvailableDays = (
    shifts: (Shift | { weekDay: number | number[] })[],
    currentIndex: number
): number[] => {
    const selectedDays = new Set(
        shifts.flatMap((shift, i) =>
            i === currentIndex
                ? []
                : Array.isArray(shift.weekDay)
                    ? shift.weekDay
                    : [shift.weekDay]
        )
    );
    return [0, 1, 2, 3, 4, 5, 6].filter(day => !selectedDays.has(day));
};
