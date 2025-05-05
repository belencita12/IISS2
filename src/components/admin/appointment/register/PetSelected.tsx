// components/PetSelected.ts
import { PetData } from "@/lib/pets/IPet";

type PetSelectedProps = {
  pet: PetData;
};

export default function PetSelected({ pet }: PetSelectedProps) {
  return (
    <div className="mt-2 p-3 border rounded-md bg-slate-50 text-black text-sm">
      <p><strong>Mascota seleccionada:</strong> {pet.name}</p>
      <p><strong>Dueño:</strong> {pet.owner.name}</p>
    </div>
  );
}
