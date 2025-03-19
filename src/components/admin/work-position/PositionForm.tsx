"use client";
import { useCallback } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { registerPosition } from "@/lib/work-position/registerPosition";
import { updatePosition } from "@/lib/work-position/updatePosition";
import { toast } from "@/lib/toast";
import { Position } from "@/lib/work-position/IPosition";
import { areDefaultShifts, DEFAULT_SHIFT, isTimeBefore, validateShifts } from "@/lib/work-position/utils/shifts";
import { positionSchema } from "@/lib/work-position/utils/validationSchemas";
import { ShiftSelector } from "./ShiftSelector";
import { useRouter } from "next/navigation";
import TimeField from "react-simple-timefield";

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
}

export default function PositionForm({ token, position }: PositionFormProps) {
    const router = useRouter();
    const isEditing = !!position;
    const defaultValues: PositionFormValues = isEditing
        ? { name: position.name, shifts: position.shifts }
        : { name: "", shifts: [DEFAULT_SHIFT] };

    const { register, handleSubmit, control, getValues, watch, formState: { errors, isSubmitting } } = useForm<PositionFormValues>({
        resolver: zodResolver(positionSchema),
        defaultValues,
    });

    const { fields, append, remove, update } = useFieldArray({ control, name: "shifts" });
    const watchShifts = watch("shifts");
    const getCurrentShifts = () => getValues("shifts");

    const updateShift = useCallback(
        (index: number, field: keyof PositionFormValues["shifts"][number], value: any) => {
            const currentShift = getValues(`shifts.${index}`);
            update(index, { ...currentShift, [field]: value });
        },
        [getValues, update]
    );

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
        const newWeekDay = validateShifts(value, currentShifts, index);
        if (newWeekDay === undefined) return;

        updateShift(index, "weekDay", newWeekDay);
    };

    const onSubmit = async (data: PositionFormValues) => {
        if (areDefaultShifts(getCurrentShifts())) {
            toast("info", "Modifica los valores predeterminados antes de guardar");
            return;
        }

        const normalizedShifts = data.shifts.flatMap((shift) => {
            const weekDays = Array.isArray(shift.weekDay) ? shift.weekDay : [shift.weekDay];
            return weekDays.map((day) => ({
                weekDay: day,
                startTime: shift.startTime,
                endTime: shift.endTime,
                id: position?.shifts.find((s) => s.weekDay === day)?.id ?? undefined,
            }));
        });

        const normalizedData: Position = { name: data.name, shifts: normalizedShifts };

        try {
            if (isEditing && position?.id) {
                await updatePosition(position.id, normalizedData, token);
                toast("success", "Puesto actualizado con éxito");
            } else {
                await registerPosition(normalizedData, token);
                toast("success", "Puesto registrado con éxito");
            }
            router.refresh();
        } catch {
            toast("error", `Error al ${isEditing ? "actualizar" : "registrar"} el puesto`);
        }
    };

    return (
        <div className="max-w-2xl p-8">
            <h1 className="text-2xl font-bold text-center mt-2">{isEditing ? "Editar puesto de trabajo" : "Agregar puesto de trabajo"}</h1>
            <form className="space-y-6 mt-8" onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <Label className="text-base font-medium">Nombre</Label>
                    <Input {...register("name")} placeholder="Ingrese un nombre" className="mt-2 w-full rounded-md border p-3 placeholder-gray-500" />
                    {errors.name && <p className="text-red-500">{errors.name.message}</p>}
                </div>
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <Label className="text-base font-medium">Horario</Label>
                        <Button type="button" onClick={addShift} variant="outline" className="border border-black px-4 py-2 bg-white text-black">Agregar Horario</Button>
                    </div>
                    <div className="space-y-2">
                        {fields.map((field, index) => {
                            const startTimeValue = watchShifts?.[index]?.startTime;
                            return (
                                <div key={field.id} className="flex items-center gap-4">
                                    <div className="flex items-center gap-4 flex-grow">
                                        <div className="w-1/4">
                                            <ShiftSelector index={index} shift={{ ...field, id: Number(field.id) }} shifts={getCurrentShifts()} control={control} onSelectDay={handleSelectDay} />
                                            {errors.shifts?.[index]?.weekDay && <p className="text-red-500 text-xs mt-1">{errors.shifts[index]?.weekDay?.message}</p>}
                                        </div>
                                        <div className="w-1/3">
                                            <Controller
                                                control={control}
                                                name={`shifts.${index}.startTime`}
                                                render={({ field: { onChange, value } }) => (
                                                    <div className="relative">
                                                        <TimeField
                                                            value={value}
                                                            onChange={onChange}
                                                            colon=":"
                                                            input={<input className="w-full border rounded-md p-2 pl-16" placeholder="Desde (HH:MM)" />}
                                                        />
                                                        <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none pr-8">Desde</span>
                                                    </div>
                                                )}
                                            />
                                            {errors.shifts?.[index]?.startTime && <p className="text-red-500 text-xs mt-1">{errors.shifts[index]?.startTime?.message}</p>}
                                        </div>
                                        <div className="w-1/3">
                                            <Controller
                                                control={control}
                                                name={`shifts.${index}.endTime`}
                                                render={({ field: { onChange, value } }) => (
                                                    <div className="relative">
                                                        <TimeField
                                                            value={value}
                                                            onChange={(e) => {
                                                                const newValue = e.target.value;
                                                                onChange(newValue);
                                                                if (isTimeBefore(newValue, startTimeValue)) {
                                                                    toast("info", `La hora de finalización debe ser posterior a la de inicio ${startTimeValue}`);
                                                                    return newValue;
                                                                }
                                                            }}
                                                            colon=":"
                                                            input={<input className="w-full border rounded-md p-2 pl-16" />}
                                                        />
                                                        <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none pr-8">Hasta</span>
                                                    </div>
                                                )}
                                            />
                                            {errors.shifts?.[index]?.endTime && <p className="text-red-500 text-xs mt-1">{errors.shifts[index]?.endTime?.message}</p>}
                                        </div>
                                    </div>
                                    <Button type="button" variant="ghost" onClick={() => removeShift(index)}><X size={18} /></Button>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="flex gap-4 pt-4 justify-start">
                    <Button type="button" variant="outline" className="py-3 border border-black rounded-md px-6">Cancelar</Button>
                    <Button type="submit" className="py-3 bg-black text-white rounded-md px-6" disabled={isSubmitting}>
                        {isSubmitting ? (isEditing ? "Actualizando..." : "Agregando...") : (isEditing ? "Actualizar Puesto" : "Agregar Puesto")}
                    </Button>
                </div>
            </form>
        </div>
    );
}
