"use client";

import { useEffect, useState } from "react";
import { toast } from "@/lib/toast";
import VaccineForm from "@/components/admin/vaccine/NewVaccineForm";
import { getVaccineById } from "@/lib/vaccine/getVaccineById";
import { VaccineFormValues } from "@/lib/vaccine/IVaccine";
import { Loader2 } from "lucide-react";

interface EditVaccinePageProps {
  token: string;
  id: string;
}

export default function EditVaccinePage({ token, id }: EditVaccinePageProps) {
  const [vaccineData, setVaccineData] = useState<VaccineFormValues | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token || !id) return;

    getVaccineById(token, Number(id))
      .then((data) => {
        const adaptedData: VaccineFormValues = {
          id: data.id,
          name: data.name,
          manufacturer: data.manufacturer,
          species: data.species,
          cost: Number(data.product.cost),
          iva: Number(data.product.iva),
          price: Number(data.product.price),
          productImgUrl: data.product?.image?.previewUrl || "",
        };
        setVaccineData(adaptedData);
      })

      .catch((error) => {
        toast("error", "Error al cargar los datos de la vacuna");
      })
      .finally(() => setLoading(false));
  }, [token, id]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-60">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  
  if (!vaccineData) return <p>No se encontró la vacuna</p>;

  return <VaccineForm token={token} initialData={vaccineData} />;
}
