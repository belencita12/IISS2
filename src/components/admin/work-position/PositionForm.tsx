"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { registerPosition } from "@/lib/work-position/registerPosition";
import { updatePosition } from "@/lib/work-position/updatePosition";
import { toast } from "@/lib/toast";
import { Position } from "@/lib/work-position/IPosition";
import { areDefaultShifts } from "@/lib/work-position/utils/shifts";
import { positionSchema } from "@/lib/work-position/utils/validationSchemas";
import { ShiftSelector } from "./ShiftSelector";
import { getDayText } from "@/lib/work-position/utils/shifts";

type PositionFormValues = {
    name: string;
    shifts: {
        weekDay: number | number[];
        startTime: string;
        endTime: string;
    }[];
};

interface PositionFormProps {
    token: string;
    position?: Position;
    onSuccess?: () => void;
}

export default function PositionForm({ token, position, onSuccess }: PositionFormProps) {
    const isEditing = !!position;
    const DEFAULT_SHIFT = { weekDay: -1, startTime: "08:00", endTime: "12:00" };
    const defaultValues = isEditing
        ? { name: position.name, shifts: position.shifts }
        : { name: "", shifts: [DEFAULT_SHIFT] };

    const { register, handleSubmit, setValue, control, formState: { errors, isSubmitting } } = useForm<PositionFormValues>({
        resolver: zodResolver(positionSchema),
        defaultValues,
    });
    const [shifts, setShifts] = useState(defaultValues.shifts);
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        if (isEditing && position?.id && !initialized) {
            setShifts(position.shifts);
            setValue("shifts", position.shifts);
            setValue("name", position.name);
            setInitialized(true);
        }
    }, [position, setValue, isEditing, initialized]);

    const updateShift = useCallback(
        (index: number, field: keyof PositionFormValues["shifts"][number], value: any) => {
            const updatedShifts = shifts.map((shift, i) =>
                i === index ? { ...shift, [field]: value } : shift
            );
            setShifts(updatedShifts);
            setValue("shifts", updatedShifts);
        },
        [shifts, setValue]
    );

    const addShift = () => {
        if (areDefaultShifts(shifts)) {
            toast("info", "Modifica los valores predeterminados antes de agregar un nuevo horario");
            return;
        }
        const newShift = { weekDay: -1, startTime: "08:00", endTime: "12:00" };
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
        let newWeekDay: number | number[];
        switch (value) {
            case "weekdays":
                newWeekDay = [1, 2, 3, 4, 5];
                break;
            case "weekdays_saturday":
                newWeekDay = [1, 2, 3, 4, 5, 6];
                break;
            default:
                newWeekDay = Number(value);
        }
        const selectedDays = shifts.flatMap((shift, i) =>
            i === index
                ? []
                : Array.isArray(shift.weekDay)
                    ? shift.weekDay
                    : [shift.weekDay]
        );

        if (Array.isArray(newWeekDay)) {
            const conflict = newWeekDay.find((day) => selectedDays.includes(day));
            if (conflict !== undefined) {
                toast("error", `El día ${getDayText(conflict)} ya tiene un horario`);
                return;
            }
        } else if (selectedDays.includes(newWeekDay)) {
            toast("error", `El día ${getDayText(newWeekDay)} ya tiene un horario`);
            return;
        }
        updateShift(index, "weekDay", newWeekDay);
    };

    const onSubmit = async (data: PositionFormValues) => {
        if (areDefaultShifts(data.shifts)) {
            toast("error", "Debe modificar el horario predeterminado");
            return;
        }
        const normalizedShifts = data.shifts.flatMap((shift) => {
            const weekDays = Array.isArray(shift.weekDay) ? shift.weekDay : [shift.weekDay];
            return weekDays.map((day) => ({
                id: position?.shifts.find(s => s.weekDay === day)?.id ?? undefined,
                weekDay: day,
                startTime: shift.startTime,
                endTime: shift.endTime,
            }));
        });

        const normalizedData: Position = {
            name: data.name,
            shifts: normalizedShifts,
        };

        try {
            if (isEditing && position?.id) {
                await updatePosition(position.id, normalizedData, token);
                toast("success", "Puesto actualizado con éxito");
            } else {
                await registerPosition(normalizedData, token);
                toast("success", "Puesto registrado con éxito");
            }
            onSuccess && onSuccess();
        } catch {
            toast("error", `Error al ${isEditing ? "actualizar" : "registrar"} el puesto`);
        }
    };

    return (
        <div className="max-w-2xl p-8">
            <div className="mt-2">
                <h1 className="text-2xl font-bold text-center">
                    {isEditing ? "Editar puesto de trabajo" : "Agregar puesto de trabajo"}
                </h1>
            </div>
            <form className="space-y-6 mt-8" onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <Label className="text-base font-medium">Nombre</Label>
                    <Input
                        {...register("name")}
                        placeholder="Ingrese un nombre"
                        className="mt-2 w-full rounded-md border p-3 placeholder-gray-500"
                    />
                    {errors.name && <p className="text-red-500">{errors.name.message}</p>}
                </div>

                <div>
                    <div className="flex justify-between items-center">
                        <Label className="text-base font-medium">Horario</Label>
                        <Button
                            type="button"
                            onClick={addShift}
                            variant="outline"
                            className="border border-black px-4 py-2 bg-white text-black"
                        >
                            Agregar Horario
                        </Button>
                    </div>
                    {errors.shifts && <p className="text-red-500">{errors.shifts.message}</p>}
                    {shifts.map((shift, index) => (
                        <div key={index} className="mt-2 flex items-center gap-3">
                            <div className="w-36">
                                <ShiftSelector index={index} shift={shift} shifts={shifts} control={control} onSelectDay={handleSelectDay} />
                            </div>
                            <div className="relative flex-1">
                                <Input
                                    type="time"
                                    {...register(`shifts.${index}.startTime`)}
                                    defaultValue={shift.startTime}
                                    className="w-full p-2 rounded-md border pl-24"
                                    onChange={(e) => updateShift(index, "startTime", e.target.value)}
                                />
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">Desde</span>
                            </div>
                            <div className="relative flex-1">
                                <Input
                                    type="time"
                                    {...register(`shifts.${index}.endTime`)}
                                    defaultValue={shift.endTime}
                                    className="w-full p-2 rounded-md border pl-24"
                                    onChange={(e) => updateShift(index, "endTime", e.target.value)}
                                />
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">Hasta</span>
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                className="p-2 text-gray-500 hover:text-red-500"
                                onClick={() => removeShift(index)}
                            >
                                <X size={18} />
                            </Button>
                        </div>
                    ))}
                </div>
                <div className="flex gap-4 pt-4 justify-start">
                    <Button type="button" variant="outline" className="py-3 border border-black rounded-md px-6">
                        Cancelar
                    </Button>
                    <Button type="submit" className="py-3 bg-black text-white rounded-md px-6" disabled={isSubmitting}>
                        {isSubmitting
                            ? isEditing ? "Actualizando..." : "Agregando..."
                            : isEditing ? "Actualizar Puesto" : "Agregar Puesto"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
