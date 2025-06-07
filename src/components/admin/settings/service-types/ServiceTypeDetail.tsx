"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import type { ServiceType } from "@/lib/service-types/types";
import { useTranslations } from "next-intl";

interface ServiceTypeDetailProps {
  data: ServiceType;
}

export default function ServiceTypeDetail({data }: ServiceTypeDetailProps) {

  const t = useTranslations();

  if (!data)
    return <div className="text-center mt-8">{t("error.notFound")}</div>;

  // URL por defecto si no hay imagen
  const defaultImageSrc = "/NotImageNicoPets.png";
  // Verificar si hay una imagen válida
  const imageUrl = data.imageUrl && data.imageUrl !== "" 
    ? data.imageUrl 
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
        <h1 className="text-2xl font-bold">{t("serviceTypes.details.title")}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        <div className="md:col-span-4 flex justify-center">
          <div className="relative w-[300px] h-[300px] border rounded-lg overflow-hidden">
            <Image
              src={imageUrl}
              alt={data.name}
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
            <h1 className="text-3xl font-bold">{capitalizeFirstLetter(data.name)}</h1>
            <p className="text-muted-foreground mt-1">{t("serviceTypes.details.slug", {slug : data.slug})}</p>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">{t("serviceTypes.details.description")}</h3>
              <p className="text-muted-foreground">{data.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-semibold">{t("serviceTypes.details.duration")}</h3>
                <p className="text-muted-foreground">{t("serviceTypes.details.durationMin", {duration: data.duration})}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold">{t("serviceTypes.details.price")}</h3>
                <p className="text-muted-foreground">{formatCurrency(data.price)}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold">{t("serviceTypes.details.cost")}</h3>
                <p className="text-muted-foreground">{formatCurrency(data.cost)}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold">{t("serviceTypes.details.iva")}</h3>
                <p className="text-muted-foreground">{t("serviceTypes.details.ivaPercentage", {iva : data.iva})}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold">{t("serviceTypes.details.colabs")}</h3>
                <p className="text-muted-foreground">{data.maxColabs}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold">{t("serviceTypes.details.status")}</h3>
                <Badge variant={data.isPublic ? "default" : "secondary"}>
                  {data.isPublic ? t("serviceTypes.status.public") : t("serviceTypes.status.private")}
                </Badge>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold">{t("serviceTypes.details.tags")}</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {data.tags && data.tags.length > 0 ? (
                  data.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))
                ) : (
                  <p className="text-muted-foreground">{t("error.notFound")}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
