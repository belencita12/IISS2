"use client";

import { useCallback } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { registerPosition } from "@/lib/work-position/registerPosition";
import { updatePosition } from "@/lib/work-position/updatePosition";
import { toast } from "@/lib/toast";
import { Position } from "@/lib/work-position/IPosition";
import { areDefaultShifts, DEFAULT_SHIFT, getDayText } from "@/lib/work-position/utils/shifts";
import { positionSchema } from "@/lib/work-position/utils/validationSchemas";
import { ShiftSelector } from "./ShiftSelector";
import { useRouter } from "next/navigation";

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
    const router = useRouter();
    const isEditing = !!position;
    const defaultValues: PositionFormValues = isEditing
        ? { name: position.name, shifts: position.shifts }
        : { name: "", shifts: [DEFAULT_SHIFT] };

    const { register, handleSubmit, control, getValues, formState: { errors, isSubmitting } } = useForm<PositionFormValues>({
        resolver: zodResolver(positionSchema),
        defaultValues,
    });
    const { fields, append, remove, update } = useFieldArray({ control, name: "shifts" });
    const getCurrentShifts = () => getValues("shifts");
    const updateShift = useCallback((index: number, field: keyof PositionFormValues["shifts"][number], value: any) => {
        const currentShift = getValues(`shifts.${index}`);
        update(index, { ...currentShift, [field]: value });
    }, [getValues, update]);
    const addShift = () => {
        if (areDefaultShifts(getCurrentShifts())) {
            toast("info", "Modifica los valores predeterminados antes de agregar un nuevo horario");
            return;
        }
        append(DEFAULT_SHIFT);
    };
    const removeShift = (index: number) => {
        if (fields.length === 1) {
            toast("info", "Debe mantener al menos un horario");
            return;
        }
        remove(index);
    };
    const handleSelectDay = (value: string, index: number) => {
        const currentShifts = getCurrentShifts();
        let newWeekDay: number | number[];
        const mappings: Record<string, number[]> = {
            weekdays: [0, 1, 2, 3, 4],
            weekdays_saturday: [0, 1, 2, 3, 4, 5],
            fullweek: [0, 1, 2, 3, 4, 5, 6],
        };
        newWeekDay = mappings[value] ?? Number(value);
        const selectedDays = currentShifts.flatMap((shift, i) =>
            i === index ? [] : Array.isArray(shift.weekDay) ? shift.weekDay : [shift.weekDay]
        );
        const conflictDay = Array.isArray(newWeekDay)
            ? newWeekDay.find(day => selectedDays.includes(day))
            : selectedDays.includes(newWeekDay) ? newWeekDay : undefined;
        if (conflictDay !== undefined) {
            toast("error", `El día ${getDayText(conflictDay)} ya tiene un horario`);
            return;
        }
        updateShift(index, "weekDay", newWeekDay);
    };

    const onSubmit = async (data: PositionFormValues) => {
        if (areDefaultShifts(getCurrentShifts())) {
            toast("info", "Modifica los valores predeterminados antes de guardar");
            return;
        }
        const normalizedShifts = data.shifts.flatMap(shift => {
            const weekDays = Array.isArray(shift.weekDay) ? shift.weekDay : [shift.weekDay];
            return weekDays.map(day => ({
                weekDay: day,
                startTime: shift.startTime,
                endTime: shift.endTime,
                id: position?.shifts.find(s => s.weekDay === day)?.id ?? undefined,
            }));
        });
        const normalizedData: Position = { name: data.name, shifts: normalizedShifts };
        console.log("Datos enviados a la API:", JSON.stringify(normalizedData, null, 2));

        try {
            if (isEditing && position?.id) {
                await updatePosition(position.id, normalizedData, token);
                toast("success", "Puesto actualizado con éxito");
            } else {
                await registerPosition(normalizedData, token);
                toast("success", "Puesto registrado con éxito");
            }
            onSuccess && onSuccess();
            router.refresh();
        } catch {
            toast("error", `Error al ${isEditing ? "actualizar" : "registrar"} el puesto`);
        }
    };
    return (
        <div className="max-w-2xl p-8">
            <h1 className="text-2xl font-bold text-center mt-2">
                {isEditing ? "Editar puesto de trabajo" : "Agregar puesto de trabajo"}
            </h1>
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
                        <Button type="button" onClick={addShift} variant="outline" className="border border-black px-4 py-2 bg-white text-black">
                            Agregar Horario
                        </Button>
                    </div>
                    {fields.map((field, index) => (
                        <div key={field.id} className="mt-4 space-y-2">
                            <div className="flex gap-3 items-start">
                                <div className="flex flex-col w-1/4">
                                    <ShiftSelector index={index} shift={{ ...field, id: Number(field.id) }} shifts={getCurrentShifts()} control={control} onSelectDay={handleSelectDay} />
                                    {errors.shifts?.[index]?.weekDay && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.shifts[index]?.weekDay?.message}
                                        </p>
                                    )}
                                </div>
                                <div className="flex flex-col w-1/4">
                                    <Input
                                        type="time"
                                        {...register(`shifts.${index}.startTime`)}
                                        className="p-2 rounded-md border"
                                        onChange={e => updateShift(index, "startTime", e.target.value)}
                                    />
                                </div>
                                <div className="flex flex-col w-1/4">
                                    <Input
                                        type="time"
                                        {...register(`shifts.${index}.endTime`)}
                                        className="p-2 rounded-md border"
                                        onChange={e => updateShift(index, "endTime", e.target.value)}
                                        onWheel={(e) => e.preventDefault()}
                                        onKeyDown={(e) => {
                                            if (e.key === 'ArrowUp') {
                                                e.preventDefault();
                                            }
                                        }}
                                    />
                                    {errors.shifts?.[index]?.endTime && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.shifts[index]?.endTime?.message}
                                        </p>
                                    )}
                                </div>
                                <Button type="button" variant="ghost" onClick={() => removeShift(index)}>
                                    <X size={18} />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex gap-4 mt-8">
                    <Button type="button" variant="outline" className="py-3 border border-black rounded-md px-6">
                        Cancelar
                    </Button>
                    <Button type="submit" className="py-3 bg-black text-white rounded-md px-6" disabled={isSubmitting}>
                        {isSubmitting ? (isEditing ? "Actualizando..." : "Agregando...") : (isEditing ? "Actualizar Puesto" : "Agregar Puesto")}
                    </Button>
                </div>
            </form>
        </div>
    );
}
