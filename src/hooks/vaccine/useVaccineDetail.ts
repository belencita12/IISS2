// src/hooks/vaccine/useVaccineDetail.ts

import { useEffect, useState, useCallback } from "react";
import { Vaccine as IVaccine } from "@/lib/vaccine/IVaccine";
import { toast } from "@/lib/toast";

// Utilidad para parsear posibles valores decimales anidados en objetos
function parseDecimal(val: unknown): number {
  if (typeof val === "object" && val !== null && "d" in val) {
    const decimal = val as { d: number[] };
    return decimal.d?.[0] ?? 0;
  }
  return Number(val);
}

export const useVaccineDetail = (id: number, token: string) => {
  const [vaccine, setVaccine] = useState<IVaccine | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVaccine = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/vaccine/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Error al obtener la vacuna");
      const data = await res.json();

      const parsedVaccine: IVaccine = {
        ...data,
        cost: parseDecimal(data.cost),
        iva: parseDecimal(data.iva),
        price: parseDecimal(data.price),
      };

      setVaccine(parsedVaccine);
    } catch (err) {
      console.error(err);
      setError("No se pudo obtener la información de la vacuna");
      toast("error", "No se pudo obtener la información de la vacuna");
    } finally {
      setLoading(false);
    }
  }, [id, token]);

  useEffect(() => {
    fetchVaccine();
  }, [fetchVaccine]);

  return {
    vaccine,
    loading,
    error,
    refetch: fetchVaccine,
  };
};
