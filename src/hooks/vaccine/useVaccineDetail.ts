// hooks/vaccine/useVaccineDetail.ts
import { useEffect, useState, useCallback } from "react";
import { Vaccine as IVaccine } from "@/lib/vaccine/IVaccine";
import { toast } from "@/lib/toast";
import { getVaccineById } from "@/lib/vaccine/getVaccineById";

export const useVaccineDetail = (id: number, token: string) => {
  const [vaccine, setVaccine] = useState<IVaccine | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVaccine = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getVaccineById(token, id);
      setVaccine(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error al obtener la vacuna";
      toast("error", message);
      setError(message);
    }
    finally {
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
