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
    const defaultValues: PositionFormValues = isEditing
        ? { name: position.name, shifts: position.shifts }
        : { name: "", shifts: [DEFAULT_SHIFT] };

    const {
        register,
        handleSubmit,
        control,
        getValues,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<PositionFormValues>({
        resolver: zodResolver(positionSchema),
        defaultValues,
    });

    const { fields, append, remove, update } = useFieldArray({
        control,
        name: "shifts",
    });

    const updateShift = useCallback(
        (index: number, field: keyof PositionFormValues["shifts"][number], value: any) => {
            const currentShift = getValues(`shifts.${index}`);
            update(index, { ...currentShift, [field]: value });
        },
        [getValues, update]
    );

    const addShift = () => {
        const currentShifts = getValues("shifts");
        if (areDefaultShifts(currentShifts)) {
            toast("info", "Modifica los valores predeterminados antes de agregar un nuevo horario");
            return;
        }
        append(DEFAULT_SHIFT);
    };

    const removeShift = (index: number) => {
        if (fields.length === 1) {
            toast("error", "Debe mantener al menos un horario");
            return;
        }
        remove(index);
    };

    const handleSelectDay = (value: string, index: number) => {
        const currentShifts = getValues("shifts");
        let newWeekDay: number | number[];
        switch (value) {
            case "weekdays":
                newWeekDay = [0, 1, 2, 3, 4];
                break;
            case "weekdays_saturday":
                newWeekDay = [0, 1, 2, 3, 4, 5];
                break;
            case "fullweek":
                newWeekDay = [0, 1, 2, 3, 4, 5, 6];
                break;
            default:
                newWeekDay = Number(value);
        }
        const selectedDays = currentShifts.flatMap((shift, i) =>
            i === index ? [] : Array.isArray(shift.weekDay) ? shift.weekDay : [shift.weekDay]
        );
        if (Array.isArray(newWeekDay)) {
            if (newWeekDay.some(day => selectedDays.includes(day))) {
                const conflict = newWeekDay.find(day => selectedDays.includes(day));
                toast("error", `El día ${conflict !== undefined ? getDayText(conflict) : ""} ya tiene un horario`);
                return;
            }
        } else if (selectedDays.includes(newWeekDay)) {
            toast("error", `El día ${getDayText(newWeekDay)} ya tiene un horario`);
            return;
        }
        updateShift(index, "weekDay", newWeekDay);
    };

    const onSubmit = async (data: PositionFormValues) => {
        const currentShifts = getValues("shifts");
        if (areDefaultShifts(currentShifts)) {
            console.log("Llega aca");
            toast("info", "Modifica los valores predeterminados antes de agregar un nuevo horario");
            return;
        }
        const normalizedShifts = data.shifts.flatMap(shift => {
            const weekDays = Array.isArray(shift.weekDay) ? shift.weekDay : [shift.weekDay];
            return weekDays.map(day => ({
                id: position?.shifts.find(s => s.weekDay === day)?.id ?? undefined,
                weekDay: day,
                startTime: shift.startTime,
                endTime: shift.endTime,
            }));
        });
        const normalizedData: Position = { name: data.name, shifts: normalizedShifts };

        try {
            if (areDefaultShifts(data.shifts)) {
                toast("error", "Debe modificar el horario predeterminado");
                return;
            }
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
            <h1 className="text-2xl font-bold text-center mt-2">
                {isEditing ? "Editar puesto de trabajo" : "Agregar puesto de trabajo"}
            </h1>
            <form className="space-y-6 mt-8" onSubmit={handleSubmit(onSubmit, (errors) => {
    console.log("Errores de validación:", errors);
})}>
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
                    {fields.map((field, index) => {
                        const startTime = watch(`shifts.${index}.startTime`);
                        return (
                            <div key={field.id} className="mt-2 flex flex-col gap-1">
                                <div className="flex items-center gap-3">
                                    <ShiftSelector
                                        index={index}
                                        shift={{ ...field, id: Number(field.id) }}
                                        shifts={getValues("shifts")}
                                        control={control}
                                        onSelectDay={handleSelectDay}
                                    />
                                    <Input
                                        type="time"
                                        {...register(`shifts.${index}.startTime` as const)}
                                        className="w-full p-2 rounded-md border"
                                        onChange={e => updateShift(index, "startTime", e.target.value)}
                                    />
                                    <Input
                                        type="time"
                                        {...register(`shifts.${index}.endTime` as const)}
                                        min={startTime}
                                        className="w-full p-2 rounded-md border"
                                        onChange={e => updateShift(index, "endTime", e.target.value)}
                                    />
                                    <Button type="button" variant="ghost" onClick={() => removeShift(index)}>
                                        <X size={18} />
                                    </Button>
                                </div>
                                {errors.shifts && errors.shifts[index]?.weekDay && (
                                    <p className="text-red-500 text-sm">
                                        {errors.shifts[index]?.weekDay.message}
                                    </p>
                                )}
                            </div>
                        );
                    })}

                </div>
                <Button type="button" variant="outline" className="py-3 border border-black rounded-md px-6">
                        Cancelar
                    </Button>
                    <Button type="submit" className="py-3 bg-black text-white rounded-md px-6" disabled={isSubmitting}>
                        {isSubmitting
                            ? isEditing
                                ? "Actualizando..."
                                : "Agregando..."
                            : isEditing
                                ? "Actualizar Puesto"
                                : "Agregar Puesto"}
                    </Button>
            </form>
        </div>
    );
}

