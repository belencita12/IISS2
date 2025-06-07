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
import { useTranslations } from "next-intl";

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

    const t = useTranslations();

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
                    t("error.errorContentType")
                );
            }
           if (!response.ok) {
            const errorData = await response.json().catch(() => ({})); 
            const message = errorData?.message || `Error HTTP: ${response.status}`;
            throw new Error(message);
        }
            toast(
                "success",
                initialData?.id
                    ? t("success.successUpdateManufacturer")
                    : t("success.successRegisterManufacturer")
            );

            reset();
            onSuccess();
            onClose();
        } catch (error) {
            toast(
                "error",
                error instanceof Error
                    ? error.message
                    : t("error.unexpectedError")
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
                            ? t("manufacturer.form.titleEdit")
                            : t("manufacturer.form.titleRegister")}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="text-left space-y-2">
                        <label className="block text-sm font-medium">
                            {t("manufacturer.form.name")}
                        </label>
                        <Input
                            {...register("name")}
                            placeholder={t("placeholder.name")}
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
                            {t("button.cancel")}
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    {initialData?.id
                                        ? t("button.saving")
                                        : t("button.registering")}
                                </>
                            ) : initialData?.id ? (
                                t("button.save")
                            ) : (
                                t("button.register")
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
