"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";
import { registerPosition } from "@/lib/work-position/registerPosition";
import { toast } from "@/lib/toast";
import { X } from "lucide-react";
import { Shift, Position } from "@/lib/work-position/IPosition";

const positionSchema = z.object({
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

// Función para verificar si los turnos son los predeterminados
const areDefaultShifts = (shifts: Shift[]): boolean => {
    return shifts.every(shift =>
        (typeof shift.weekDay === 'number' && shift.weekDay === 1) || 
        (Array.isArray(shift.weekDay) && shift.weekDay.length === 1 && shift.weekDay[0] === 1)
    ) && shifts.every(shift => shift.startTime === "08:00" && shift.endTime === "12:00");
};

// Función para obtener el texto del día
const getDayText = (weekDay: number | number[]): string => {
    const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
    if (typeof weekDay === 'number') return days[weekDay - 1] || "Día";
    if (Array.isArray(weekDay)) {
        if (weekDay.length === 5 && weekDay.every((day, i) => day === i + 1)) return "Lunes a Viernes";
        if (weekDay.length === 6 && weekDay.every((day, i) => day === i + 1)) return "Lunes a Sábado";
        return getDayText(weekDay[0]);
    }
    return "Día";
};

type PositionFormValues = z.infer<typeof positionSchema>;

interface PositionFormProps {
    token: string;
}

export default function PositionForm({ token }: PositionFormProps) {
    const { register, handleSubmit, setValue, watch, control, formState: { errors, isSubmitting } } = useForm<PositionFormValues>({
        resolver: zodResolver(positionSchema),
        defaultValues: { name: "", shifts: [{ weekDay: 1, startTime: "08:00", endTime: "12:00" }] },
    });
    const [shifts, setShifts] = useState<Shift[]>([{ weekDay: 1, startTime: "08:00", endTime: "12:00" }]);

    const addShift = () => {
        if (areDefaultShifts(shifts)) {
            toast("error", "Modifica los valores predeterminados antes de agregar un nuevo horario");
            return;
        }
        const newShift = { weekDay: 1, startTime: "08:00", endTime: "12:00" };
        const updatedShifts = [...shifts, newShift];
        setShifts(updatedShifts);
        setValue("shifts", updatedShifts);
    };

    const removeShift = (index: number) => {
        if (shifts.length === 1) {
            toast("error", "Debe mantener al menos un horario");
            return;
        }
        const updatedShifts = shifts.filter((_, i) => i !== index);
        setShifts(updatedShifts);
        setValue("shifts", updatedShifts);
    };

    const handleSelectDay = (value: string, index: number) => {
        const updatedShifts = [...shifts];
        updatedShifts[index].weekDay = value === "weekdays" ? [1, 2, 3, 4, 5] : value === "weekdays_saturday" ? [1, 2, 3, 4, 5, 6] : Number(value);
        setShifts(updatedShifts);
        setValue("shifts", updatedShifts);
    };

    const onSubmit = async (data: PositionFormValues) => {
        if (areDefaultShifts(data.shifts)) {
            toast("error", "Debe modificar el horario predeterminado");
            return;
        }
        const normalizedShifts = data.shifts.flatMap((shift) => {
            const weekDays = Array.isArray(shift.weekDay) ? shift.weekDay : [shift.weekDay];
            return weekDays.map((day) => ({
                weekDay: day,
                startTime: shift.startTime,
                endTime: shift.endTime,
            }));
        });
        const normalizedData: Position = { name: data.name, shifts: normalizedShifts };
        try {
            await registerPosition(normalizedData, token);
            toast("success", "Puesto registrado con éxito");
        } catch {
            toast("error", "Error al registrar el puesto");
        }
    };

    const getDayValue = (weekDay: number | number[]): string => {
        if (typeof weekDay === 'number') return String(weekDay);
        if (Array.isArray(weekDay)) {
            if (weekDay.length === 5 && weekDay.every((day, i) => day === i + 1)) return "weekdays";
            if (weekDay.length === 6 && weekDay.every((day, i) => day === i + 1)) return "weekdays_saturday";
            return String(weekDay[0]);
        }
        return "1";
    };

    const getAvailableDays = (index: number) => {
        const selectedDays = shifts.flatMap(shift =>
            Array.isArray(shift.weekDay) ? shift.weekDay : [shift.weekDay]
        );
        return Array.from({ length: 7 }, (_, i) => i + 1).filter(day => !selectedDays.includes(day));
    };

    return (
        <div className="max-w-2xl p-8">
            <div className="mt-2">
                <h1 className="text-2xl font-bold text-center">Agregar puesto de trabajo</h1>
            </div>
            <form className="space-y-6 mt-8" onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <Label className="text-base font-medium">Nombre</Label>
                    <Input {...register("name")} placeholder="Ingrese un nombre" className="mt-2 w-full rounded-md border p-3 placeholder-gray-500" />
                    {errors.name && <p className="text-red-500">{errors.name.message}</p>}
                </div>

                <div>
                    <div className="flex justify-between items-center">
                        <Label className="text-base font-medium">Horario</Label>
                        <Button type="button" onClick={addShift} variant="outline" className="border border-black px-4 py-2 bg-white text-black">
                            Agregar Horario
                        </Button>
                    </div>
                    {errors.shifts && <p className="text-red-500">{errors.shifts.message}</p>}
                    {shifts.map((shift, index) => (
                        <div key={index} className="mt-2 flex items-center gap-3">
                            <div className="w-36">
                                <Controller
                                    name={`shifts.${index}.weekDay`}
                                    control={control}
                                    render={({ field }) => (
                                        <Select onValueChange={(value) => handleSelectDay(value, index)} value={getDayValue(shift.weekDay)}>
                                            <SelectTrigger className="w-full p-2 rounded-md border">
                                                <SelectValue placeholder="Día">{getDayText(shift.weekDay)}</SelectValue>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="weekdays">Lunes a Viernes</SelectItem>
                                                <SelectItem value="weekdays_saturday">Lunes a Sábado</SelectItem>
                                                {getAvailableDays(index).map(day => (
                                                    <SelectItem key={day} value={String(day)}>
                                                        {["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"][day - 1]}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>

                            <div className="relative flex-1">
                                <Input type="time" {...register(`shifts.${index}.startTime`)} defaultValue={shift.startTime} className="w-full p-2 rounded-md border pl-24" onChange={(e) => {
                                    const updatedShifts = [...shifts];
                                    updatedShifts[index].startTime = e.target.value;
                                    setShifts(updatedShifts);
                                }} />
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">Desde</span>
                            </div>

                            <div className="relative flex-1">
                                <Input type="time" {...register(`shifts.${index}.endTime`)} defaultValue={shift.endTime} className="w-full p-2 rounded-md border pl-24" onChange={(e) => {
                                    const updatedShifts = [...shifts];
                                    updatedShifts[index].endTime = e.target.value;
                                    setShifts(updatedShifts);
                                }} />
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">Hasta</span>
                            </div>

                            <Button type="button" variant="ghost" className="p-2 text-gray-500 hover:text-red-500" onClick={() => removeShift(index)}>
                                <X size={18} />
                            </Button>
                        </div>
                    ))}
                </div>

                <div className="flex gap-4 pt-4 justify-start">
                    <Button type="button" variant="outline" className="py-3 border border-black rounded-md px-6">Cancelar</Button>
                    <Button type="submit" className="py-3 bg-black text-white rounded-md px-6" disabled={isSubmitting}>
                        {isSubmitting ? "Agregando..." : "Agregar Puesto"}
                    </Button>
                </div>
            </form>
        </div>
    );
}