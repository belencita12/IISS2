"use client"

import type React from "react"

import { useState, type FormEvent, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input" 
import { cn } from "@/lib/utils"

interface IFormState {
    password: string
    confirmPassword: string
    isLoading: boolean
    message: string
    isError: boolean
}

export default function PasswordResetForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [token, setToken] = useState<string | null>(null)
    const [formState, setFormState] = useState<IFormState>({
        password: "",
        confirmPassword: "",
        isLoading: false,
        message: "",
        isError: false,
    })

    useEffect(() => {
        const tokenFromUrl = searchParams.get("token")
        if (!tokenFromUrl) {
            router.push("/")
        } else {
            setToken(tokenFromUrl)
        }
    }, [searchParams, router])

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (!token) return

        setFormState((prev) => ({ ...prev, isLoading: true, message: "", isError: false }))

        if (formState.password !== formState.confirmPassword) {
            setFormState((prev) => ({
                ...prev,
                isLoading: false,
                message: "Las contraseñas no coinciden",
                isError: true,
            }))
            return
        }

        try {
            const response = await fetch("https://iiss2-backend.onrender.com/auth/reset-password", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, newPassword: formState.password }),
            })

            if (response.ok) {
                setFormState((prev) => ({
                    ...prev,
                    isLoading: false,
                    message: "Contraseña restablecida con éxito. Redirigiendo...",
                }))
                setTimeout(() => router.push("/login"), 3000)
            } else {
                throw new Error("Error al restablecer la contraseña")
            }
        } catch (error) {
            setFormState((prev) => ({
                ...prev,
                isLoading: false,
                message: "Hubo un problema al restablecer tu contraseña. Por favor, intenta de nuevo.",
                isError: true,
            }))
        }
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target
        setFormState((prev) => ({ ...prev, [name]: value }))
    }

    if (!token) {
        return null 
    }

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
                            <div className="mt-1">
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
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                Confirmar nueva contraseña
                            </label>
                            <div className="mt-1">
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
                                {formState.isLoading ? "Procesando..." : "Restablecer contraseña"}
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

