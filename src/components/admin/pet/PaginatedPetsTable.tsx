"use client";

import GenericTable, { Column } from "@/components/global/GenericTable";
import {getPetsByUserIdFull } from "@/lib/pets/getPetsByUserId";
import { PetData } from "@/lib/pets/IPet";
import { Pencil, Trash } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import PetsTableSkeleton from "./skeleton/PetsTableSkeleton";
import { set } from "react-hook-form";


export default function PaginatedPetsTable({ token,id }: { token: string ,id:number}) {
    const onEdit = (pet: PetData) => {
    console.log("Edit pet", pet);
    }
    const onDelete = (pet: PetData) => {
    console.log("Delete pet", pet);
    }
  const columns: Column<PetData>[] = [
    {
      header: "",
      accessor: (pet) => (
        <Image
          src={pet.profileImg?.previewUrl || "/image (4).png"}
          alt={pet.name}
          width={30}
          height={30}
          className="rounded-full"
        />
      ),
      className: "w-[50px]"
    },
    {
      header: "Nombre",
      accessor: "name",
      className: "font-medium"
    },
    {
      header: "Especie",
      accessor: (pet) => pet.species.name
    },
    {
      header: "Raza",
      accessor: (pet) => pet.race.name
    }
  ];

  const actions = [
    {
      icon: <Pencil className="w-4 h-4" />,
      onClick: onEdit,
      label: "Editar mascota"
    },
    {
      icon: <Trash className="w-4 h-4" />,
      onClick: onDelete,
      label: "Eliminar mascota"
    }
  ];

  const [pets, setPets] = useState<PetData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    pageSize: 4
  });

  useEffect(() => {
    const fetchPets = async () => {
      try {
        setIsLoading(true);
        const data = await getPetsByUserIdFull(id, token, pagination.currentPage);
        setPets(data.data);
        setPagination({
          currentPage: data.currentPage,
          totalPages: data.totalPages,
          totalItems: data.total,
          pageSize: data.size
        });
      } catch (error) {
        console.error("Error al obtener mascotas", error);
      }
      finally {
        setIsLoading(false);
      }
    };

    fetchPets();
  }, [pagination.currentPage, token,id]);

  return (
    <GenericTable
      data={pets}
      columns={columns}
      actions={actions}
      pagination={pagination}
      isLoading={isLoading}
      skeleton={<PetsTableSkeleton />}
      onPageChange={(page) => setPagination({ ...pagination, currentPage: page })}
      emptyMessage="No hay mascotas disponibles"
    />
  );
}