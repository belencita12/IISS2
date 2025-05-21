"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/lib/toast";

const vaccineManufacturerSchema = z.object({
    name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
});

type Manufacturer = {
    id: number;
    name: string;
};

type ManufacturerFormModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    initialData?: Manufacturer | null;
    token: string;
};

export default function ManufacturerFormModal({
    isOpen,
    onClose,
    onSuccess,
    initialData,
    token,
}: ManufacturerFormModalProps) {
    const [loading, setLoading] = useState(false);
    const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: zodResolver(vaccineManufacturerSchema),
        defaultValues: initialData ? { name: initialData.name } : { name: "" },
    });

    useEffect(() => {
        if (initialData) {
            reset({ name: initialData.name });
        } else {
            reset({ name: "" });
        }
    }, [initialData, reset]);

    const onSubmit = async (data: { name: string }) => {
        setLoading(true);
        try {
            const url = initialData?.id
                ? `${API_BASE_URL}/vaccine-manufacturer/${initialData.id}`
                : `${API_BASE_URL}/vaccine-manufacturer`;
            const method = initialData?.id ? "PATCH" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });

            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new Error(
                    "Error: La API devolvió una respuesta no válida (posible HTML en lugar de JSON)"
                );
            }

            const responseData = await response.json();
            if (!response.ok) {
                throw new Error(
                    `Error: ${response.status} - ${
                        responseData.message || "No se pudo guardar"
                    }`
                );
            }

            toast(
                "success",
                initialData?.id
                    ? "Fabricante actualizado correctamente"
                    : "Fabricante creado correctamente"
            );

            reset();
            onSuccess();
            onClose();
        } catch (error) {
            console.error(error);
            toast(
                "error",
                error instanceof Error
                    ? error.message
                    : "Ocurrió un error inesperado"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => {
                if (!loading && !open) {
                    onClose();
                }
            }}
        >
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {initialData?.id
                            ? "Editar Fabricante"
                            : "Registrar Fabricante"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="text-left space-y-2">
                        <label className="block text-sm font-medium">
                            Nombre
                        </label>
                        <Input
                            {...register("name")}
                            placeholder="Nombre del fabricante"
                            className="p-2 border rounded-md w-full"
                            disabled={loading}
                        />
                        {errors.name && (
                            <p className="text-red-500 text-xs">
                                {errors.name.message}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end space-x-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    {initialData?.id
                                        ? "Guardando..."
                                        : "Registrando..."}
                                </>
                            ) : initialData?.id ? (
                                "Guardar cambios"
                            ) : (
                                "Registrar"
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
