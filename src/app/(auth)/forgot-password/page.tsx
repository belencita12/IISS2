"use client"

import type React from "react"

import { useState, type FormEvent } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button" 
import { cn } from "@/lib/utils"

interface IFormState {
    email: string
    isLoading: boolean
    message: string
    isError: boolean
}

const HARDCODED_LOGIN_URL = `${process.env.NEXT_PUBLIC_BASE_URL}`;
export default function PasswordRecoveryForm() {
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
            const response = await fetch(`${HARDCODED_LOGIN_URL}/auth/token/reset-password`, {
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
            } 
            else if (response.status == 401) {
                setFormState((prev) => ({
                    ...prev,
                    isLoading: false,
                    message: "Este correo no esta asociado a ninguna cuenta. Verifica el correo e intenta nuevamente",
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
                            <Button type="submit" disabled={formState.isLoading} className="w-full">
                                {formState.isLoading ? "Enviando..." : "Enviar enlace de recuperación"}
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
    )
}

