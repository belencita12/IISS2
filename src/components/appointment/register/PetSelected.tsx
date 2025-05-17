import type { PetData } from "@/lib/pets/IPet";

type PetSelectedProps = {
  pet: PetData;
};

export default function PetSelected({ pet }: PetSelectedProps) {
  return (
    <div className="mt-3 p-4 rounded-md bg-gray-100 border border-gray-200 text-myPurple-focus text-sm shadow-sm">
      <div className="flex items-start gap-3">
        <div>
          <p className="text-myPurple-focus/70 mt-1">
            Mascota: {pet.name}
          </p>
          <p className="text-myPurple-focus/70 mt-1">
            Raza: {pet.race.name}
          </p>
        </div>
      </div>
    </div>
  );
}