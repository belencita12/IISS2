"use client";

import { useEffect, useState } from "react";
import { getAuth } from "./getAuth"; // Asegúrate de que esta función también funcione del lado cliente
import Image from "next/image";

interface ProfileUserProps {
  clientId: number;
  token: string;
}

export function ProfileUser({ clientId, token }: ProfileUserProps) {
  const [authData, setAuthData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuthData = async () => {
      try {
        const data = await getAuth(token);
        setAuthData(data);
      } catch (error) {
        console.error("Error fetching auth data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthData();
  }, [token]);

  if (loading) return <p className="mt-4 text-center">Cargando datos del usuario...</p>;
  if (!authData) return <p className="mt-4 text-center">No se pudo obtener la información del usuario.</p>;

  return (
    <div className="mt-4 p-4 border rounded shadow-md bg-white space-y-2">
      <div className="flex items-center gap-4">
        <Image
          src={authData.image?.originalUrl ?? "/blank-profile-picture-973460_1280.png"}
          alt="Avatar"
          width={64}
          height={64}
          className="rounded-full"
        />
        <div>
          <p className="font-semibold text-lg">{authData.fullName ?? "Sin nombre"}</p>
          <p className="text-sm text-gray-600">{authData.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-4">
        <p><strong>RUC:</strong> {authData.ruc ?? "No disponible"}</p>
        <p><strong>Teléfono:</strong> {authData.phone ?? "No disponible"}</p>
        <p><strong>Dirección:</strong> {authData.address ?? "No disponible"}</p>
        <p><strong>Cliente ID:</strong> {clientId}</p>
      </div>

      <pre className="mt-4 p-2 bg-gray-100 text-sm overflow-auto rounded">
        {JSON.stringify(authData, null, 2)}
      </pre>
    </div>
  );
}
