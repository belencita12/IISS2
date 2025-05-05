import { useEffect, useState } from "react";
import { getManufacturerById } from "@/lib/vaccine-manufacturer/getVaccineManufacturerById";
import { getVaccineById } from "@/lib/vaccine/getVaccineById";
import { VaccineManufacturer, Vaccine } from "@/lib/vaccine-manufacturer/IVaccineManufacturer";
import { toast } from "@/lib/toast";

export const useManufacturerDetail = (id: number, token: string) => {
  const [manufacturer, setManufacturer] = useState<VaccineManufacturer | null>(null);
  const [vaccines, setVaccines] = useState<Vaccine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getManufacturerById(token, id);
        setManufacturer({ id: response.id, name: response.name });

        const enrichedVaccines: Vaccine[] = await Promise.all(
          (response.vaccine || []).map(async (v: { id: number }) => {
            return await getVaccineById(token, v.id); 
          })
        );

        setVaccines(enrichedVaccines);
      } catch (error) {
        toast("error", "No se pudo obtener el fabricante");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, token]);

  return { manufacturer, vaccines, loading };
};
