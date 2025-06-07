"use client";

import UpdatePetImage from "@/components/pet/UpdatePetImage";
import { PetData } from "@/lib/pets/IPet";

interface EditPetProps {
  pet: PetData;
  token: string;
  onPetUpdate: (pet: PetData) => void;
  showEditButton: boolean;
}

export default function EditPet({ pet, token, onPetUpdate, showEditButton }: EditPetProps) {
  return 1
}