'use client'
import VaccineManufacturerForm from "@/components/admin/vaccine/VaccineManufacturerForm";
import { useEffect, useState } from "react";

export default function NewVaccineManufacturerPage() {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
    setLoading(false);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Crear Fabricante de Vacunas</h1>
      {loading ? <p>Cargando...</p> : token ? <VaccineManufacturerForm token={token} /> : <p>Error: No hay token disponible</p>}
    </div>
  );
}
