"use client";

import PaginatedPetsTable from "./PaginatedPetsTable";
import { PetData } from "@/lib/pets/IPet";

export default function ClientPetsTableWrapper({ pets }: { pets: PetData[] }) {
  const handleEditPet = (pet: PetData) => {
    console.log("Edit pet:", pet.id);
    // Add your edit logic here
  };

  const handleDeletePet = (pet: PetData) => {
    console.log("Delete pet:", pet.id);
    // Add your delete logic here
  };

  return (
    <PaginatedPetsTable 
      pets={pets} 
      onEdit={handleEditPet}
      onDelete={handleDeletePet}
    />
  );
}