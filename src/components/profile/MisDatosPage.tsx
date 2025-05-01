"use client";

import { useEffect, useState } from "react";
import { IUserProfile } from "@/lib/client/IUserProfile";
import { getAuth } from "./getAuth";
import { toast } from "@/lib/toast";

interface MisDatosProps {
  token: string;
}

export const MisDatos = ({ token }: MisDatosProps) => {
  const [client, setClient] = useState<IUserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAuth(token);
        setClient(data);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "Error al cargar datos";
        toast("error", errorMessage);
        setError(errorMessage);
      }
    };
    if (token) fetchData();
  }, [token]);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!client) return <p>Cargando...</p>;

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow border mt-8">
      <h2 className="text-2xl font-bold mb-6">Información Personal</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6">
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700">Nombre</label>
          <div className="bg-gray-100 rounded px-4 py-3 text-base">{client.fullName}</div>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700">Email</label>
          <div className="bg-gray-100 rounded px-4 py-3 text-base">{client.email}</div>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700">Teléfono</label>
          <div className="bg-gray-100 rounded px-4 py-3 text-base">{client.phoneNumber}</div>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700">Dirección</label>
          <div className="bg-gray-100 rounded px-4 py-3 text-base">{client.adress}</div>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700">RUC</label>
          <div className="bg-gray-100 rounded px-4 py-3 text-base">{client.ruc}</div>
        </div>
      </div>
    </div>
  );
};
