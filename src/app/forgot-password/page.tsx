"use client"

import type React from "react"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"

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
            const response = await fetch("https://iiss2-backend.onrender.com/auth/token/reset-password", {
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
            } else {
                throw new Error("Error al enviar el email")
            }
        } catch (error) {
            setFormState((prev) => ({
                ...prev,
                isLoading: false,
                message: "Hubo un problema al procesar tu solicitud. Por favor, intenta de nuevo.",
                isError: true,
            }))
        }
    }

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormState((prev) => ({ ...prev, email: event.target.value }))
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Recuperar contraseña</h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Correo electrónico
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={formState.email}
                                    onChange={handleEmailChange}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={formState.isLoading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                            >
                                {formState.isLoading ? "Enviando..." : "Enviar enlace de recuperación"}
                            </button>
                        </div>
                    </form>

                    {formState.message && (
                        <div className={`mt-4 text-sm ${formState.isError ? "text-red-600" : "text-green-600"}`}>
                            {formState.message}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

