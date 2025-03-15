"use client";
import { getSession } from "next-auth/react";
import EmployeeForm from "@/components/employee/EmployeeForm";
import { useEffect, useState } from "react";

export default function EmployeesPage() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSession() {
      const session = await getSession();
      if (session?.user.token) {
        setToken(session.user.token as string);
      }
    }
    fetchSession();
  }, []);

  if (!token) return <p>Cargando...</p>;

  return (
    <main className="py-6 px-20">
      <h1 className="text-2xl font-bold mb-4">Registrar Empleado</h1>
      <EmployeeForm token={token} />
    </main>
  );
}
