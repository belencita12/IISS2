import { Shift } from "@/lib/work-position/IPosition";

export const areDefaultShifts = (shifts: Shift[]): boolean => {
    return shifts.some(
        (shift) =>
            shift.weekDay === -1 &&
            shift.startTime === "08:00" &&
            shift.endTime === "12:00"
    );
};

export const getDayText = (weekDay: number | number[]): string => {
    const days = [
        "Lunes",
        "Martes",
        "Miércoles",
        "Jueves",
        "Viernes",
        "Sábado",
        "Domingo"
    ];
    if (typeof weekDay === "number") {
        if (weekDay === -1) return "Seleccionar día";
        return days[weekDay] || "Día";
    }
    if (Array.isArray(weekDay)) {
        // Para [0,1,2,3,4] muestra "Lunes a Viernes"
        if (weekDay.length === 5 && weekDay.every((day, i) => day === i))
            return "Lunes a Viernes";
        // Para [0,1,2,3,4,5] muestra "Lunes a Sábado"
        if (weekDay.length === 6 && weekDay.every((day, i) => day === i))
            return "Lunes a Sábado";
        return getDayText(weekDay[0]);
    }
    return "Día";
};

export const getDayValue = (weekDay: number | number[]): string => {
    if (typeof weekDay === "number") {
        return weekDay === -1 ? "" : String(weekDay);
    }
    if (Array.isArray(weekDay)) {
        if (weekDay.length === 5 && weekDay.every((day, i) => day === i))
            return "weekdays";
        if (weekDay.length === 6 && weekDay.every((day, i) => day === i))
            return "weekdays_saturday";
        return String(weekDay[0]);
    }
    return "";
};
export const getAvailableDays = (
    shifts: Shift[],
    currentIndex: number
): number[] => {
    const selectedDays = shifts.flatMap((shift) =>
        Array.isArray(shift.weekDay) ? shift.weekDay : [shift.weekDay]
    );
    return Array.from({ length: 7 }, (_, i) => i + 1).filter(
        (day) => !selectedDays.includes(day)
    );
};