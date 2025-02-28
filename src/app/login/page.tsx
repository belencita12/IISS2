"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"

interface ILoginData {
    email: string
    password: string
}

export default function LoginForm() {
    const [loginData, setLoginData] = useState<ILoginData>({
        email: "",
        password: "",
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()



        console.log("Form submitted:", loginData)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLoginData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }))
    }

    return (
        <div className="mt-[100px] flex items-center justify-center">
            <div className="flex justify-between items-center w-full max-w-3xl mx-auto gap-x-8">
                <div className="w-1/2">
                    <h1 className="text-2xl font-semibold text-black m-0">Login</h1>
                    <p className="text-sm text-gray-600 mt-2 mb-6">
                        Ingresa tus credenciales para ir a tu cuenta
                    </p>
                </div>

                <div className="w-1/2">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="w-full">
                            <input
                                type="email"
                                name="email"
                                placeholder="Ingrese su correo"
                                value={loginData.email}
                                onChange={handleChange}
                                className="w-full px-3 py-3 border border-gray-200 rounded-md text-sm outline-none transition-colors focus:border-black"
                                required
                            />
                        </div>

                        <div className="w-full">
                            <input
                                type="password"
                                name="password"
                                placeholder="Ingrese su contraseña"
                                value={loginData.password}
                                onChange={handleChange}
                                className="w-full px-3 py-3 border border-gray-200 rounded-md text-sm outline-none transition-colors focus:border-black"
                                required
                            />
                        </div>

                        <div className="flex justify-end">
                            <Link
                                href="/forgot-password"
                                className="text-sm text-gray-600 hover:text-black transition-colors"
                            >
                                Olvidé mi contraseña
                            </Link>
                        </div>

                        <button
                            type="submit"
                            className="w-full px-3 py-3 border-none rounded-md bg-black text-white text-sm cursor-pointer transition-colors hover:bg-gray-800"
                        >
                            Log In
                        </button>

                        <p className="text-center text-sm text-gray-600 mt-2">
                            Aún no estás registrado?{" "}
                            <Link href="/register" className="text-black hover:underline">
                                Regístrate!
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    )
}

