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
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const res = await signIn("credentials", {
            redirect: false,
            email: loginData.email,
            password: loginData.password,
        });

        setLoading(false);

        if (res?.error) {
            setError("Credenciales incorrectas. Inténtalo de nuevo.");
        } else {
            router.push("/dashboard");
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLoginData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <div className="mt-10 flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center w-full max-w-3xl mx-auto gap-8">
                <div className="w-full md:w-1/2 text-center md:text-left">
                    <h1 className="text-2xl font-semibold text-black">Login</h1>
                    <p className="text-sm text-gray-600 mt-2 mb-6">
                        Ingresa tus credenciales para acceder a tu cuenta.
                    </p>
                </div>

                <div className="w-full md:w-1/2">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                        {error && <p className="text-red-500 text-sm mt-[5px] mb-[5px]">{error}</p>}

                        <ValidatedInput
                            type="email"
                            name="email"
                            placeholder="Ingrese su correo"
                            value={loginData.email}
                            onChange={handleChange}
                            required
                        />

                        <ValidatedInput
                            type="password"
                            name="password"
                            placeholder="Ingrese su contraseña"
                            value={loginData.password}
                            onChange={handleChange}
                            required
                        />

                        <div className="flex justify-end">
                            <Button variant="outline" className="flex-1" asChild>
                                <Link href="/forgot-password">Olvide mi contraseña</Link>
                            </Button>
                        </div>

                        <Button type="submit" variant="default" className="w-full" disabled={loading}>
                            {loading ? "Cargando..." : "Iniciar Sesión"}
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