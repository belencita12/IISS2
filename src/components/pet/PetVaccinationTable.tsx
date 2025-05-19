"use client";

import GenericTable, { Column } from "@/components/global/GenericTable";
import { Eye } from "lucide-react";
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

  const v = useTranslations("VaccuneTable");
  const e = useTranslations("Error");
  const b = useTranslations("Button");

  const columns: Column<VaccineRecord>[] = [
    {
      header: v("date"),
      accessor: (vac) => formatDate(vac.applicationDate || vac.createdAt),
      className: "font-medium",
    },
    {
      header: v("details"),
      accessor: (vac) => vac.vaccine.name,
    },
    {
      header: v("expectedDate"),
      accessor: (vac) => formatDate(vac.expectedDate),
    },
    {
      header: v("dosis"),
      accessor: (vac) => vac.dose,
    },
  ];

  const actions = [
    {
      icon: <Eye className="w-4 h-4" />,
      onClick: (vac: VaccineRecord) => {
        router.push(`/user-profile/pet/${petId}`);
      },
      label: b("edit"),
    }    
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
        toast("error", error instanceof Error ? error.message : e("errorLoad", {field: "vacunas"}));
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
      actions={actions}
      actionsTitle={v("actions")}
      pagination={pagination}
      isLoading={isLoading}
      skeleton={<PetVaccinationListSkeleton />}
      onPageChange={(page) =>
        setPagination({ ...pagination, currentPage: page })
      }
      emptyMessage={e("notFoundField", {field: "vacunas"})}
    />
  );
}