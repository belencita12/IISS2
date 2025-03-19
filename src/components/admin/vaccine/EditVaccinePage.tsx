"use client";

import { useEffect, useState } from "react";
import { toast } from "@/lib/toast";
import VaccineForm from "@/components/admin/vaccine/NewVaccineForm"; 
import { getVaccineById } from "@/lib/vaccine/getVaccineById";

interface Manufacturer {
  id: number;
  name: string;
}

interface Species {
  id: number;
  name: string;
}

interface Vaccine {
  id: number;
  name: string;
  manufacturer: Manufacturer;
  species: Species;
  cost: number;
  iva: number;   
  price: number;
}

interface EditVaccinePageProps {
  token: string;
  id: string;
}

export default function EditVaccinePage({ token, id }: EditVaccinePageProps) {
  const [vaccineData, setVaccineData] = useState<Vaccine | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token || !id) return;

    getVaccineById(token, Number(id))
      .then((data) => {
        console.log("Datos de la vacuna (API):", data);

 
        const adaptedData = {
          ...data,
          iva: data.IVA,  
        };


        setVaccineData(adaptedData);
      })
      .catch((error) => {
        console.error(error);
        toast("error", "Error al cargar los datos de la vacuna");
      })
      .finally(() => setLoading(false));
  }, [token, id]);

  if (loading) return <p>Cargando datos...</p>;
  if (!vaccineData) return <p>No se encontró la vacuna</p>;

  return <VaccineForm token={token} initialData={vaccineData} />;
}
