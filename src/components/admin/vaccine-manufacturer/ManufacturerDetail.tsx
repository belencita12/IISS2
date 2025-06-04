"use client";

import { useRouter } from "next/navigation";
import { useManufacturerDetail } from "@/hooks/vaccine-manufacturer/useManufacturerDetail";
import { Eye } from "lucide-react";
import GenericTable, {
  Column,
  TableAction,
} from "@/components/global/GenericTable";
import VaccineTableSkeleton from "../vaccine/skeleton/VaccineTableSkeleton";
import { useTranslations } from "next-intl";
import { useVaccineList } from "@/hooks/vaccine/useVaccineList";
import { useEffect } from "react";
import { Loading } from "@/components/global/Loading";


interface Props {
  id: number;
  token: string;
}

export default function ManufacturerDetail({ id, token }: Props) {
  const router = useRouter();
  const {
    loading: vaccinesLoading,
    data: vaccines,
    loadVaccines,
  } = useVaccineList(token);
  const { manufacturer, loading } = useManufacturerDetail(id, token);

  const t = useTranslations();

  useEffect(() => {
    if (token)
      loadVaccines(vaccines.pagination.currentPage, { manufacturerId: id });
  }, [token, vaccines.pagination.currentPage, loadVaccines, id]);

  const handleView = (id: number) => router.push(`/dashboard/vaccine/${id}`);

  if (loading)
    return (
      <div className="my-8">
        <Loading />
      </div>
    );

  if (!manufacturer) return <p>{t("error.notFound")}</p>;

  const columns: Column<(typeof vaccines.vaccines)[number]>[] = [
    {
      header: t("vaccine.table.name"),
      accessor: (item) => item.name,
    },
    {
      header: t("vaccine.table.specie"),
      accessor: (item) => item.species?.name ?? "—",
    },
    {
      header: t("vaccine.table.price"),
      accessor: (item) =>
        item.product?.price
          ? t("vaccine.table.priceGs", {price: item.product.price.toLocaleString("es-PY")})
          : "—",
    },
  ];

  // Acciones
  const actions: TableAction<(typeof vaccines.vaccines)[number]>[] = [
    {
      icon: <Eye className="w-4 h-4" />,
      onClick: (item) => handleView(item.id),
      label: t("button.seeDetails"),
    },
  ];

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-3xl font-bold">
        {t("vaccine.table.manufacturer")}: {manufacturer.name}
      </h1>
      <h2 className="text-xl font-semibold">{t("vaccine.table.vaccineAsociated")}</h2>
      <GenericTable
        data={vaccines.vaccines}
        columns={columns}
        actions={actions}
        emptyMessage={t("vaccine.table.emptyMessageForManufacturer")}
        skeleton={<VaccineTableSkeleton />}
        isLoading={vaccinesLoading}
      />
    </div>
  );
}
