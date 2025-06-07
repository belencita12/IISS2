"use client";

import { notFound, useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useVaccineDetail } from "@/hooks/vaccine/useVaccineDetail";
import { useTranslations } from "next-intl";

interface Props {
  id: number;
  token: string;
}

export const VaccineDetail = ({ id, token }: Props) => {
  const router = useRouter();
  const { vaccine, loading, error } = useVaccineDetail(id, token);
  const t = useTranslations();

  if (loading) return <p className="text-center mt-10">{t("button.loading")}</p>;
  if (error || !vaccine)
    return notFound();

  return (
    <div className="flex flex-col justify-between mt-5 p-4 mx-2">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Imagen o inicial */}
        <div className="w-full md:w-1/4 flex justify-center">
          <Image
            src={vaccine.product.image?.originalUrl || "/NotImageNicoPets.png"}
            alt={vaccine.name}
            width={260}
            height={260}
            className="object-contain"
          />
        </div>

        {/* Detalles */}
        <div className="w-full md:w-3/4 space-y-4 mr-4">
          <h1 className="text-2xl font-bold">{vaccine.name}</h1>
          <Detail label={t("vaccine.details.manufacturer")} value={vaccine.manufacturer.name} />
          <Detail label={t("vaccine.details.specie")} value={vaccine.species.name} />
          <Detail
            label={t("vaccine.details.cost")}
            value={t("vaccine.details.priceGs", {price: vaccine.product.cost.toLocaleString("es-PY")})}
          />
          <Detail
            label={t("vaccine.details.iva")}
            value={t("vaccine.details.ivaPercentage", {iva: vaccine.product.iva.toLocaleString("es-PY")})}
          />
          <Detail
            label={t("vaccine.details.price")}
            value={t("vaccine.details.priceGs", {price: vaccine.product.price.toLocaleString("es-PY")})}
          />
          <Detail
            label={t("vaccine.details.quantity")}
            value={t("vaccine.details.uds", {quantity: vaccine.product.quantity})}
          />
        </div>
      </div>

      {/* Botones */}
      <div className="flex gap-4 mt-6 justify-end">
        <Button variant="outline" onClick={() => router.push("/dashboard/vaccine")}>
          {t("button.toReturn")}
        </Button>
        <Button onClick={() => router.push(`/dashboard/vaccine/edit/${vaccine.id}`)}>
          {t("button.edit")}
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
