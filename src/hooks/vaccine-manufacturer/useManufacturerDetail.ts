import { useEffect, useState } from "react";
import { getManufacturerById } from "@/lib/vaccine-manufacturer/getVaccineManufacturerById";
import { VaccineManufacturer } from "@/lib/vaccine-manufacturer/IVaccineManufacturer";
import { toast } from "@/lib/toast";

export const useManufacturerDetail = (id: number, token: string) => {
  const [manufacturer, setManufacturer] = useState<VaccineManufacturer | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getManufacturerById(token, id);
        setManufacturer({ id: response.id, name: response.name });
      } catch (error:unknown) {
        if(error instanceof Error)
        toast("error", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, token]);

  return { manufacturer, loading };
};
