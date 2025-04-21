"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { toast } from "@/lib/toast";

interface Props {
  id: number;
  token: string;
}

interface Vaccine {
  id: number;
  name: string;
  cost: number;
  iva: number;
  price: number;
  manufacturer: { id: number; name: string };
  species: { id: number; name: string };
  image?: { originalUrl: string };
}

type DecimalLike = {
  d: number[]; // dígitos
  e: number;   // exponente
  s: number;   // signo
};


export const VaccineDetail = ({ id, token }: Props) => {
  const [vaccine, setVaccine] = useState<Vaccine | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  function parseDecimal(val: unknown): number {
    if (typeof val === "object" && val !== null && "d" in val) {
      const decimal = val as DecimalLike;
      return decimal.d?.[0] ?? 0;
    }
    return Number(val);
  }
  

  useEffect(() => {
    const fetchVaccine = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/vaccine/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Error al cargar la vacuna");
        const data = await res.json();
      
        console.log("VACUNA RAW:", data);

        setVaccine({
          ...data,
          cost: parseDecimal(data.product?.cost),
          iva: parseDecimal(data.product?.iva),
          price: parseDecimal(data.product?.price),
        });
        
      } catch (error) {
        toast("error", "No se pudo cargar la información de la vacuna");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchVaccine();
  }, [id, token]);

  if (loading) return <p className="text-center mt-10">Cargando...</p>;
  if (!vaccine)
    return <p className="text-center mt-10">No se encontró la vacuna.</p>;

  return (
    <div className="flex flex-col justify-between mt-5 p-4 mx-2">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Imagen o inicial */}
        <div className="w-full md:w-1/4 flex justify-center">
          {vaccine.image?.originalUrl ? (
            <Image
              src={vaccine.image.originalUrl}
              alt={vaccine.name}
              width={260}
              height={260}
              className="object-contain"
            />
          ) : (
            <div className="w-64 h-64 bg-gray-200 flex items-center justify-center text-4xl font-bold rounded">
              {vaccine.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
  
        {/* Detalles */}
        <div className="w-full md:w-3/4 space-y-4 mr-4">
          <h1 className="text-2xl font-bold">{vaccine.name}</h1>
          <Detail label="Fabricante" value={vaccine.manufacturer.name} />
          <Detail label="Especie" value={vaccine.species.name} />
          <Detail
            label="Costo"
            value={
              typeof vaccine.cost === "number"
                ? `Gs. ${vaccine.cost.toLocaleString("es-PY")}`
                : "N/A"
            }
          />
          <Detail
            label="IVA"
            value={
              typeof vaccine.iva === "number"
                ? `${vaccine.iva.toLocaleString("es-PY")} %`
                : "N/A"
            }
          />
          <Detail
            label="Precio"
            value={
              typeof vaccine.price === "number"
                ? `Gs. ${vaccine.price}`
                : "N/A"
            }
          />
        </div>
      </div>
  
      {/* Botones en la parte inferior */}
      <div className="flex gap-4 mt-6 justify-end">
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard/vaccine")}
        >
          Volver
        </Button>
        <Button onClick={() => router.push(`/dashboard/vaccine/edit/${vaccine.id}`)}>
          Editar
        </Button>
      </div>
    </div>
  );
  
};

const Detail = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between items-center border-b py-1">
    <span className="text-gray-500">{label}</span>
    <span className="font-medium">{value}</span>
  </div>
);
