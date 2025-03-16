"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function WorkScheduleForm() {
    return (
        <div className="max-w-3xl mx-auto p-8">
            <form className="space-y-6">
                <div>
                    <Label className="text-base font-medium">Nombre</Label>
                    <Input
                        placeholder="Ingrese un nombre"
                        className="mt-2 w-full rounded-md border p-3"
                    />
                </div>

                <div>
                    <Label className="text-base font-medium">Horario</Label>
                    <div className="mt-2 flex flex-wrap gap-3 items-center">
                        <div className="w-44">
                            <Select>
                                <SelectTrigger className="p-3 rounded-md border">
                                    <SelectValue placeholder="Día" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">Lunes</SelectItem>
                                    <SelectItem value="2">Martes</SelectItem>
                                    <SelectItem value="3">Miércoles</SelectItem>
                                    <SelectItem value="4">Jueves</SelectItem>
                                    <SelectItem value="5">Viernes</SelectItem>
                                    <SelectItem value="6">Sábado</SelectItem>
                                    <SelectItem value="7">Domingo</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Input type="time" placeholder="Desde (HH:MM)" className="w-56 p-3 rounded-md border" />
                        <Input type="time" placeholder="Hasta (HH:MM)" className="w-56 p-3 rounded-md border" />
                        <Button type="button" variant="outline" className="rounded-md border border-black px-4 py-2 bg-white text-black">
                            Agregar Horario
                        </Button>
                    </div>
                </div>
                
                <div className="flex gap-4 pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        className="flex-1 py-3 border border-black rounded-md"
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        className="flex-1 py-3 bg-black text-white rounded-md"
                    >
                        Agregar Puesto
                    </Button>
                </div>
            </form>
        </div>
    );
}
