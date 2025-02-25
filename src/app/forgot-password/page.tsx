"use client"

import type React from "react"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface IFormState {
    email: string
    isLoading: boolean
    message: string
    isError: boolean
}

export default function PasswordRecoveryForm() {
    const router = useRouter()
    const [formState, setFormState] = useState<IFormState>({
        email: "",
        isLoading: false,
        message: "",
        isError: false,
    })

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setFormState((prev) => ({ ...prev, isLoading: true, message: "", isError: false }))

        try {
            const response = await fetch("https://iiss2-backend.onrender.com/auth/token/reset-password/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: formState.email }),
            })

            if (response.ok) {
                setFormState((prev) => ({
                    ...prev,
                    isLoading: false,
                    message: "Email enviado correctamente. Por favor, revisa tu bandeja de entrada.",
                }))
            } else if (response.status === 401) {
                setFormState((prev) => ({
                    ...prev,
                    isLoading: false,
                    message: "Este correo no esta asociado a una cuenta. Verifica tu correo e intenta nuevamente.",
                    isError: true
                }))
            }

            else {
                const errorData = await response.json()
                throw new Error(errorData.message || "Error al enviar el email")
            }
        } catch (error) {
            setFormState((prev) => ({
                ...prev,
                isLoading: false,
                message:
                    error instanceof Error
                        ? error.message
                        : "Hubo un problema al procesar tu solicitud. Por favor, intenta de nuevo.",
                isError: true,
            }))
        }
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormState((prev) => ({ ...prev, email: event.target.value }))
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Recuperar contraseña</h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Ingresa tu correo electrónico para recibir un enlace de recuperación
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Correo electrónico
                            </label>
                            <div className="mt-1">
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={formState.email}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={formState.isLoading}
                                className={cn(
                                    "w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors duration-200",
                                    formState.isLoading && "opacity-50 cursor-not-allowed",
                                )}
                            >
                                {formState.isLoading ? "Enviando..." : "Enviar enlace de recuperación"}
                            </button>
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
    )
}

