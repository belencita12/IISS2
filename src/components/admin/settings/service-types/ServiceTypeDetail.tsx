"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getServiceTypeById } from "@/lib/service-types/getServiceTypeById";
import type { ServiceType } from "@/lib/service-types/types";
import { toast } from "@/lib/toast";

interface ServiceTypeDetailProps {
  token: string;
}

export default function ServiceTypeDetail({ token }: ServiceTypeDetailProps) {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id || '';
  const [serviceType, setServiceType] = useState<ServiceType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id || id === "create") {
      setIsLoading(false);
      return;
    }
    const fetchData = async () => {
      try {
        const serviceTypeData = await getServiceTypeById(id as string, token);
        console.log('Datos recibidos:', serviceTypeData); // Para ver los datos recibidos
        console.log('Costo del servicio:', serviceTypeData.cost); // Para ver específicamente el costo
        setServiceType(serviceTypeData);
      } catch (err) {
        toast("error", "No se pudo cargar la información del tipo de servicio");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id, token]);

  if (isLoading) return <div className="text-center mt-8">Cargando...</div>;
  if (!serviceType)
    return <div className="text-center mt-8">Tipo de servicio no encontrado</div>;

  // URL por defecto si no hay imagen
  const defaultImageSrc = "/NotImageNicoPets.png";
  // Verificar si hay una imagen válida
  const imageUrl = serviceType.imageUrl && serviceType.imageUrl !== "" 
    ? serviceType.imageUrl 
    : defaultImageSrc;

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-PY', {
      style: 'currency',
      currency: 'PYG'
    }).format(amount);
  };

  const capitalizeFirstLetter = (string: string): string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Detalle de Tipos de Servicios</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        <div className="md:col-span-4 flex justify-center">
          <div className="relative w-[300px] h-[300px] border rounded-lg overflow-hidden">
            <Image
              src={imageUrl}
              alt={serviceType.name}
              fill
              className="object-cover"
              priority
              unoptimized
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = defaultImageSrc;
              }}
            />
          </div>
        </div>

        <div className="md:col-span-8 flex flex-col space-y-4 pl-6">
          <div>
            <h1 className="text-3xl font-bold">{capitalizeFirstLetter(serviceType.name)}</h1>
            <p className="text-muted-foreground mt-1">Slug: {serviceType.slug}</p>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Descripción</h3>
              <p className="text-muted-foreground">{serviceType.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-semibold">Duración</h3>
                <p className="text-muted-foreground">{serviceType.duration} minutos</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold">Precio</h3>
                <p className="text-muted-foreground">{formatCurrency(serviceType.price)}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold">Costo</h3>
                <p className="text-muted-foreground">{formatCurrency(serviceType.cost)}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold">IVA</h3>
                <p className="text-muted-foreground">{serviceType.iva}%</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold">Máximo de Colaboradores</h3>
                <p className="text-muted-foreground">{serviceType.maxColabs}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold">Estado</h3>
                <Badge variant={serviceType.isPublic ? "default" : "secondary"}>
                  {serviceType.isPublic ? "Público" : "Privado"}
                </Badge>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Etiquetas</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {serviceType.tags && serviceType.tags.length > 0 ? (
                  serviceType.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))
                ) : (
                  <p className="text-muted-foreground">No hay etiquetas</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-6">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="px-6"
        >
          Volver
        </Button>
      </div>
    </div>
  );
} 