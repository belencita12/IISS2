"use client"

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface IFormState {
    password: string;
    confirmPassword: string;
    isLoading: boolean;
    message: string;
    isError: boolean;
}

export default function PasswordResetForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [formState, setFormState] = useState<IFormState>({
        password: "",
        confirmPassword: "",
        isLoading: false,
        message: "",
        isError: false,
    });

    useEffect(() => {
        if (!token) {
            router.push("/");
        }
    }, [token, router]);
    

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!token) {
            setFormState((prev) => ({ ...prev, message: "Token no válido.", isError: true }));
            return;
        }

        if (formState.password !== formState.confirmPassword) {
            setFormState((prev) => ({
                ...prev,
                isLoading: false,
                message: "Las contraseñas no coinciden",
                isError: true,
            }));
            return;
        }

        setFormState((prev) => ({ ...prev, isLoading: true, message: "", isError: false }));

        try {
            const response = await fetch(`https://actual-maribeth-fiuni-9898c42e.koyeb.app/auth/reset-password?token=${token}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ password: formState.password }),
            });
            

            const data = await response.json();

            if (!response.ok) throw new Error("Error al restablecer la contraseña");

            setFormState({
                password: "",
                confirmPassword: "",
                isLoading: false,
                message: "Contraseña restablecida con éxito. Redirigiendo...",
                isError: false,
            });

            setTimeout(() => router.push("/login"), 3000);
        } catch (error) {
            setFormState((prev) => ({
                ...prev,
                isLoading: false,
                message: "Ha ocurrido un error, por favor vuelva a solicitar un cambio de contraseña. Redirigiendo....",
                isError: true,
            }));
            setTimeout(() => router.push("/forgot-password"), 6000);
        }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormState((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Restablecer contraseña</h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Nueva contraseña
                            </label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                value={formState.password}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                Confirmar nueva contraseña
                            </label>
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                autoComplete="new-password"
                                required
                                value={formState.confirmPassword}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div>
                            <Button type="submit" disabled={formState.isLoading} className="w-full">
                                {formState.isLoading ? "Procesando..." : "Restablecer contraseña"}
                            </Button>
                        </div>
                    </form>

                    {formState.message && (
                        <div className={cn("mt-4 text-sm", formState.isError ? "text-red-600" : "text-green-600")}>
                            {formState.message}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
