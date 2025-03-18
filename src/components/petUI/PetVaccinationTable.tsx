"use client";

import GenericTable, { Column } from "@/components/global/GenericTable";
import { Bell} from "lucide-react";
import PetsTableSkeleton from "../admin/pet/skeleton/PetsTableSkeleton";
import { VaccineRecord } from "@/lib/vaccine-registry/IVaccineRegistry";
import { useEffect, useState } from "react";
import { getByPetId } from "@/lib/vaccine-registry/getByPetId";


export default function PetVaccinationTable(
  { token,petId }: { token: string ,petId:number}
) {
    const onReminder = (vac: VaccineRecord) => {
    console.log("reminder", vac);
    }

  const columns: Column<VaccineRecord>[] = [
    {
      header: "Fecha",
      accessor: (vac)=>vac.applicationDate,
      className: "font-medium"
    },
    {
      header: "Detalles de la Vacuna",
      accessor: (vac) => vac.name
    },
    {
      header: "Fecha Prevista",
      accessor: (vac) => vac.expectedDate
    },
    {
      header: "Dosis",
      accessor: (vac) => vac.dose
    },
  ];

  const actions = [
    {
      icon: <Bell className="w-4 h-4" />,
      onClick: onReminder,
      label: "Recordatorio"
    }
  ];

  const [vaccines, setVaccines] = useState<VaccineRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    pageSize: 4
  });

  useEffect(() => {
    const fetchVaccines = async () => {
      try {
        setIsLoading(true);
        const data = await getByPetId(petId, token);
        if(!data) {
          setVaccines([]);
          return;
        }
        setVaccines(data.data);
        setPagination({
          currentPage: data.currentPage,
          totalPages: data.totalPages,
          totalItems: data.total,
          pageSize: data.size
        });
      } catch (error) {
        console.error("Error al obtener vacunas", error);
      }
      finally {
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
      actionsTitle="Recordatorio"
      pagination={pagination}
      isLoading={isLoading}
      skeleton={<PetsTableSkeleton />}
      onPageChange={(page) => setPagination({ ...pagination, currentPage: page })}
      emptyMessage="No hay vacunas registradas"
    />
  );
}