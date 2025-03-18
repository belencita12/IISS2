import { Shift } from "@/lib/work-position/IPosition";

const DEFAULT_SHIFT = { weekDay: -1, startTime: "08:00", endTime: "12:00" };

export const areDefaultShifts = (shifts: Shift[]): boolean =>
    shifts.some(
        (shift) =>
            shift.weekDay === DEFAULT_SHIFT.weekDay &&
            shift.startTime === DEFAULT_SHIFT.startTime &&
            shift.endTime === DEFAULT_SHIFT.endTime
    );

export const getDayText = (weekDay: number | number[]): string => {
    const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    if (typeof weekDay === "number") {
        if (weekDay === DEFAULT_SHIFT.weekDay) return "Seleccionar día";
        return days[weekDay - 1] || "Día";
    }
    if (Array.isArray(weekDay)) {
        if (weekDay.length === 5 && weekDay.every((day, i) => day === i + 1))
            return "Lunes a Viernes";
        if (weekDay.length === 6 && weekDay.every((day, i) => day === i + 1))
            return "Lunes a Sábado";
        return getDayText(weekDay[0]);
    }
    return "Día";
};

export const getDayValue = (weekDay: number | number[]): string => {
    if (typeof weekDay === "number") {
        return weekDay === DEFAULT_SHIFT.weekDay ? "" : String(weekDay);
    }
    if (Array.isArray(weekDay)) {
        if (weekDay.length === 5 && weekDay.every((day, i) => day === i + 1))
            return "weekdays";
        if (weekDay.length === 6 && weekDay.every((day, i) => day === i + 1))
            return "weekdays_saturday";
        return String(weekDay[0]);
    }
    return "";
};

export const getAvailableDays = (shifts: Shift[], currentIndex: number): number[] => {
    const selectedDays = new Set(
        shifts.flatMap((shift, i) =>
            i === currentIndex
                ? []
                : Array.isArray(shift.weekDay)
                    ? shift.weekDay
                    : [shift.weekDay]
        )
    );
    return [1, 2, 3, 4, 5, 6].filter((day) => !selectedDays.has(day));
};
