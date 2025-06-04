"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { getServiceTypeById } from "@/lib/service-types/getServiceTypeById";
import { ServiceType } from "@/lib/service-types/types";
import NotImageNicoPets from "../../../public/NotImageNicoPets.png";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Tag } from "lucide-react";
import { notFound } from "next/navigation";

export default function ServiceDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [service, setService] = useState<ServiceType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchService = async () => {
      if (!id || Array.isArray(id)) return notFound();

      try {
        const fetchedService = await getServiceTypeById(id);
        setService(fetchedService);
      } catch (error) {
        notFound();
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-10 text-myPurple-primary">
        Cargando servicio...
      </div>
    );
  }

  if (!service) return notFound();

  return (
    <div className="bg-gray-50 min-h-screen py-6 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            className="flex items-center text-purple-600 hover:text-purple-900 pl-0"
            onClick={() => router.back()}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Volver a servicios
          </Button>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-12">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/2 p-6 flex items-center justify-center">
              <div className="relative w-full aspect-square max-w-md">
                <Image
                  src={service.imageUrl?.trim() || NotImageNicoPets.src}
                  alt={service.name}
                  fill
                  style={{ objectFit: "contain" }}
                  className="rounded-lg"
                />
              </div>
            </div>

            <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col bg-gray-50 rounded-lg m-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-4 text-gray-800">
                  {service.name}
                </h1>

                <p className="text-gray-700 font-medium mb-6">
                  {service.description}
                </p>

                <p className="text-purple-700 text-3xl font-bold mb-6">
                  Gs. {service.price.toLocaleString()}
                </p>

                <p className="text-purple-700 text-lg font-semibold mb-6">
                  Duración: {service.duration} minutos
                </p>

                {service.tags?.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-2 flex items-center text-gray-700">
                      <Tag className="h-4 w-4 mr-1 text-purple-600" />
                      Etiquetas
                    </h3>
                    <div className="flex gap-2 flex-wrap">
                      {service.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
