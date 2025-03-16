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

export default function PositionForm() {
    return (
        <div className=" max-w-2xl p-8">
            <form className="space-y-6 mt-8">
                <div>
                    <Label className="text-base font-medium">Nombre</Label>
                    <Input
                        placeholder="Ingrese un nombre"
                        className="mt-2 w-full rounded-md border p-3 placeholder-gray-500"
                    />
                </div>

                <div>
                    <Label className="text-base font-medium">Horario</Label>
                    <div className="mt-2 flex items-center gap-3">
                        <div className="w-36">
                            <Select>
                                <SelectTrigger className="w-full p-2 rounded-md border">
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

                        <div className="relative flex-1">
                            <Input
                                type="time"
                                className="w-full p-2 rounded-md border pl-24"
                            />
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
                                Desde
                            </span>
                        </div>

                        <div className="relative flex-1">
                            <Input
                                type="time"
                                className="w-full p-2 rounded-md border pl-24"
                            />
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
                                Hasta
                            </span>
                        </div>

                        <Button
                            type="button"
                            variant="outline"
                            className="rounded-md border border-black px-4 py-2 bg-white text-black"
                        >
                            Agregar Horario
                        </Button>
                    </div>
                </div>

                <div className="flex gap-4 pt-4 justify-start">
                    <Button
                        type="button"
                        variant="outline"
                        className="py-3 border border-black rounded-md px-6"
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        className="py-3 bg-black text-white rounded-md px-6"
                    >
                        Agregar Puesto
                    </Button>
                </div>
            </form>
        </div>
    );
}