"use client";

import GenericTable, { Column } from "@/components/global/GenericTable";
import { VaccineRecord } from "@/lib/vaccine-registry/IVaccineRegistry";
import { useEffect, useState } from "react";
import { getByPetId } from "@/lib/vaccine-registry/getByPetId";
import { formatDate } from "@/lib/utils";
import { useRouter } from "next/navigation";
import PetVaccinationListSkeleton from "./skeleton/PetVaccinationTableSkeleton";
import { useTranslations } from "next-intl";
import { toast } from "@/lib/toast";

export default function PetVaccinationTable({
  token,
  petId,
  Id,
}: {
  token: string;
  petId: number;
  Id: number;
}) {
  const onReminder = (vac: VaccineRecord) => {
    console.log("reminder", vac);
  };
  const router = useRouter();
  
  const t = useTranslations();

  const columns: Column<VaccineRecord>[] = [
    {
      header: t("vaccine.table.date"),
      accessor: (vac) => formatDate(vac.applicationDate || vac.createdAt),
      className: "font-medium",
    },
    {
      header: t("vaccine.table.details"),
      accessor: (vac) => vac.vaccine.name,
    },
    {
      header: t("vaccine.table.expectedDate"),
      accessor: (vac) => formatDate(vac.expectedDate),
    },
    {
      header: t("vaccine.table.dosis"),
      accessor: (vac) => vac.dose,
    },
  ];

  const [vaccines, setVaccines] = useState<VaccineRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    pageSize: 5,
  });

  useEffect(() => {
    const fetchVaccines = async () => {
      try {
        setIsLoading(true);
        const data = await getByPetId(petId, token, pagination.currentPage);
        if (!data) {
          setVaccines([]);
          return;
        }
        setVaccines(data.data);
        setPagination({
          currentPage: data.currentPage,
          totalPages: data.totalPages,
          totalItems: data.total,
          pageSize: data.size,
        });
      } catch (error: unknown) {
        if (error instanceof Error) toast("error", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVaccines();
  }, [pagination.currentPage, token, petId]);

  return (
    <GenericTable
      data={vaccines}
      columns={columns}
      pagination={pagination}
      isLoading={isLoading}
      skeleton={<PetVaccinationListSkeleton />}
      onPageChange={(page) =>
        setPagination({ ...pagination, currentPage: page })
      }
      emptyMessage={t("vaccine.table.emptyMessage")}
    />
  );
}