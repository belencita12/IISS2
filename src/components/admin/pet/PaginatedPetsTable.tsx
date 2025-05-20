"use client";

import GenericTable, { Column } from "@/components/global/GenericTable";
import {getPetsByUserIdFull } from "@/lib/pets/getPetsByUserId";
import { PetData } from "@/lib/pets/IPet";
import { Eye, Pencil, Trash } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import PetsTableSkeleton from "./skeleton/PetsTableSkeleton";
import { useRouter } from "next/navigation";
import { toast } from "@/lib/toast";
import { ConfirmationModal } from "@/components/global/Confirmation-modal";
import { deletePet } from "@/lib/pets/deletePet";
import { useTranslations } from "next-intl";

export default function PaginatedPetsTable({ token,id }: { token: string ,id:number}) {
    const router = useRouter();
    const [selectedPet, setSelectedPet] = useState<PetData | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [pets, setPets] = useState<PetData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const p = useTranslations("PetForm");
    const s = useTranslations("Success");
    const e = useTranslations("Error");
    const b = useTranslations("Button");
    const m = useTranslations("ModalConfirmation");

    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        pageSize: 4
    });

    const onRedirect = (pet: PetData) => {
      router.push(`/dashboard/clients/${id}/pet/${pet.id}`);
    };

    const onEdit = (pet: PetData) => {
      router.push(`/dashboard/clients/${id}/pet/${pet.id}/edit`);
    };

    const onDelete = (pet: PetData) => {
      setSelectedPet(pet);
      setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
      if (!selectedPet?.id) return;
      
      const success = await deletePet(token, selectedPet.id);
      
      if (success) {
        toast("success", s("successDelete", {field: "Mascota"}));
        setIsDeleteModalOpen(false);
        setSelectedPet(null);
        // Recargar la lista de mascotas
        setIsLoading(true);
        const data = await getPetsByUserIdFull(id, token, pagination.currentPage);
        setPets(data.data);
        setIsLoading(false);
        setPagination({
          currentPage: data.currentPage,
          totalPages: data.totalPages,
          totalItems: data.total,
          pageSize: data.size
        });
      } else {
        toast("error", e("errorDelete", {field: "mascota"}));
      }
    };

    const columns: Column<PetData>[] = [
        {
          header: "",
          accessor: (pet) => (
            <Image
              src={pet.profileImg?.previewUrl || "/imagen-mascota/default.jpg"}
              alt={pet.name}
              width={30}
              height={30}
              className="rounded-full object-cover w-[30px] h-[30px]"
            />
          ),
          className: "w-[50px]"
        },
        {
          header: p("name"),
          accessor: "name",
          className: "font-medium"
        },
        {
          header: p("specie"),
          accessor: (pet) => pet.species.name
        },
        {
          header: p("race"),
          accessor: (pet) => pet.race.name
        }
    ];

    const actions = [
        {
          icon: <Eye className="w-4 h-4" />,
          onClick: onRedirect,
          label: b("seeDetails")
        },
        {
          icon: <Pencil className="w-4 h-4" />,
          onClick: onEdit,
          label: b("edit")
        },
        {
          icon: <Trash className="w-4 h-4" />,
          onClick: onDelete,
          label: b("delete")
        }
    ];

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
            const errorMessage = (error as Error).message || e("errorLoad", {field: "mascotas"});
            toast("error",errorMessage);
          }
          finally {
            setIsLoading(false);
          }
        };

        fetchPets();
    }, [pagination.currentPage, token, id]);

    return (
        <>
            <GenericTable
                data={pets}
                columns={columns}
                actions={actions}
                pagination={pagination}
                isLoading={isLoading}
                skeleton={<PetsTableSkeleton />}
                onPageChange={(page) => setPagination({ ...pagination, currentPage: page })}
                emptyMessage={e("notFoundPets")}
            />
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setSelectedPet(null);
                }}
                onConfirm={handleConfirmDelete}
                title={m("confirmDelete", {field: "mascota"})}
                message={`La mascota ${selectedPet?.name} será eliminada permanentemente.`}
                confirmText={b("delete")}
                cancelText={b("cancel")}
                variant="danger"
            />
        </>
    );
}