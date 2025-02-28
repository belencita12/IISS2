"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button"
import { ValidatedInput } from "@/components/global/ValidatedInput"

interface ILoginData {
    email: string;
    password: string;
}

export default function LoginForm() {
    const [loginData, setLoginData] = useState<ILoginData>({ email: "", password: "" });
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLoginData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <div className="mt-[100px] flex items-center justify-center">
            <div className="flex justify-between items-center w-full max-w-3xl mx-auto gap-x-8">
                <div className="w-1/2">
                    <h1 className="text-2xl font-semibold text-black">Login</h1>
                    <p className="text-sm text-gray-600 mt-2 mb-6">
                        Ingresa tus credenciales para acceder a tu cuenta.
                    </p>
                </div>

                <div className="w-1/2">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="w-full">
                            <ValidatedInput
                                type="email"
                                name="email"
                                placeholder="Ingrese su correo"
                                value={loginData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="w-full">
                            <ValidatedInput
                                type="password"
                                name="password"
                                placeholder="Ingrese su contraseña"
                                value={loginData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {error && <p className="text-red-500 text-sm">{error}</p>}

                        <div className="flex justify-end">
                            <Button variant="outline" className="flex-1" asChild>
                                <Link href="/forgot-password">Olvide mi contraseña</Link>
                            </Button>
                        </div>

                        <Button type="submit" variant="default" className="w-full">
                            Log In
                        </Button>

                        <p className="text-center text-sm text-gray-600 mt-2">
                            ¿Aún no estás registrado? {" "}
                            <Link href="/register" className="text-black hover:underline">
                                Regístrate!
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
