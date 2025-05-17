"use client";

import { useRouter } from "next/navigation";
import { useManufacturerDetail } from "@/hooks/vaccine-manufacturer/useManufacturerDetail";
import { Eye } from "lucide-react";
import GenericTable, {
  Column,
  TableAction,
} from  "@/components/global/GenericTable";
import VaccineTableSkeleton from "../vaccine/skeleton/VaccineTableSkeleton";
import { useTranslations } from "next-intl";

interface Props {
  id: number;
  token: string;
}

export default function ManufacturerDetail({ id, token }: Props) {
  const router = useRouter();
  const { manufacturer, vaccines, loading } = useManufacturerDetail(id, token);

  const v = useTranslations("VaccineDetail");
  const b = useTranslations("Button");
  const e = useTranslations("Error");


  const handleView = (id: number) => router.push(`/dashboard/vaccine/${id}`);

  //if (loading) return <p className="text-center mt-10">{b("loading")}</p>;
  if (!manufacturer) return <p>{e("notFound")}</p>;

  // Columnas para la tabla
  const columns: Column<(typeof vaccines)[number]>[] = [
    {
      header: v("name"),
      accessor: "name",
    },
    {
      header: v("specie"),
      accessor: (item) => item.species?.name ?? "—",
    },
    {
      header: v("price"),
      accessor: (item) =>
        item.product?.price
          ? `Gs. ${item.product.price.toLocaleString("es-PY")}`
          : "—",
    },
  ];

  // Acciones
  const actions: TableAction<(typeof vaccines)[number]>[] = [
    {
      icon: <Eye className="w-4 h-4" />,
      onClick: (item) => handleView(item.id),
      label: b("seeDetails"),
    },
  ];

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-3xl font-bold">{v("manufacturer")}: {manufacturer.name}</h1>
      <h2 className="text-xl font-semibold">{v("vaccineAsociated")}</h2>
        <GenericTable
          data={vaccines}
          columns={columns}
          actions={actions}
          emptyMessage={v("emptyMessage")}
          skeleton={<VaccineTableSkeleton />}
          isLoading={loading}
        />
    </div>
  );
}
