"use client";

import GenericTable, { Column } from "@/components/global/GenericTable";
import { Bell} from "lucide-react";
import PetsTableSkeleton from "../admin/pet/skeleton/PetsTableSkeleton";
import { VaccineRecord } from "@/lib/vaccine-registry/IVaccineRegistry";
import { useState } from "react";


export default function PetVaccinationTable() {
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

  const vacMock: VaccineRecord[] = [
    {
        applicationDate: "2022-01-01",
        createdAt: "2022-01-01",
        dose: 1,
        expectedDate: "2022-01-01",
        id: 1,
        name: "Vacuna 1",
        petId: 1,
        updatedAt: "2022-01-01",
        vaccineId: 1
    },
    {
        applicationDate: "2022-01-01",
        createdAt: "2022-01-01",
        dose: 1,
        expectedDate: "2022-01-01",
        id: 2,
        name: "Vacuna 2",
        petId: 1,
        updatedAt: "2022-01-01",
        vaccineId: 2
    },
    {
        applicationDate: "2022-01-01",
        createdAt: "2022-01-01",
        dose: 1,
        expectedDate: "2022-01-01",
        id: 3,
        name: "Vacuna 3",
        petId: 1,
        updatedAt: "2022-01-01",
        vaccineId: 3
    },
    {
        applicationDate: "2022-01-01",
        createdAt: "2022-01-01",
        dose: 1,
        expectedDate: "2022-01-01",
        id: 4,
        name: "Vacuna 4",
        petId: 1,
        updatedAt: "2022-01-01",
        vaccineId: 4
    }
    ];

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    pageSize: 4
  });


  return (
    <GenericTable
      data={vacMock}
      columns={columns}
      actions={actions}
      actionsTitle="Recordatorio"
      pagination={pagination}
      isLoading={false}
      skeleton={<PetsTableSkeleton />}
      onPageChange={(page) => setPagination({ ...pagination, currentPage: page })}
      emptyMessage="No hay vacunas registradas"
    />
  );
}