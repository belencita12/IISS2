"use client"
//hola
import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ValidatedInput } from "@/components/global/ValidatedInput"

interface IFormData {
    username: string
    email: string
    password: string
    confirmPassword: string
}

export default function RegisterForm() {
    const [formData, setFormData] = useState<IFormData>({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    })

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
            setError("Todos los campos son obligatorios.");
            return;
        }

        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email)) {
            setError("Ingrese un correo válido.");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        try {
            const response = await fetch(`https://actual-maribeth-fiuni-9898c42e.koyeb.app/auth/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                setError(data.message || "Ocurrió un error al registrarse.");
                return;
            }

            setSuccess("Registro exitoso. Redirigiendo...");
            setFormData({ username: "", email: "", password: "", confirmPassword: "" });

            setTimeout(() => {
                router.push("/login");
            }, 2000);
        } catch (error) {
            setError("Error de conexión. Inténtalo nuevamente.");
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    }

    return (
        <div className="mt-[30px] mb-[50px] flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-center w-full max-w-3xl mx-auto gap-x-8">
                <div className="w-full sm:w-1/2 text-center sm:text-left mb-6 sm:mb-0">
                    <h1 className="text-2xl font-semibold text-black m-0">Registro</h1>
                    <p className="text-sm text-gray-600 mt-2 mb-6">Crea una nueva cuenta</p>
                </div>
                <div className="w-full sm:w-1/2 max-w-[400px]">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        {success && <p className="text-green-500 text-sm">{success}</p>}
                        <br />

                        <ValidatedInput
                            type="text"
                            name="username"
                            placeholder="Ingrese su nombre"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />

                        <ValidatedInput
                            type="email"
                            name="email"
                            placeholder="Ingrese su correo"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />

                        <ValidatedInput
                            type="password"
                            name="password"
                            placeholder="Ingrese su contraseña"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />

                        <ValidatedInput
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirme su contraseña"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />

                        <div className="flex flex-col sm:flex-row gap-4 mt-2">
                            <Button variant="outline" className="flex-1" asChild>
                                <Link href="/login">Tengo una cuenta</Link>
                            </Button>
                            <Button type="submit" className="flex-1">Registrarme</Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
