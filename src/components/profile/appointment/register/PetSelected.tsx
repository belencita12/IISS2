import type { PetData } from "@/lib/pets/IPet"
import { PawPrint } from "lucide-react"

type PetSelectedProps = {
  pet: PetData
}

export default function PetSelected({ pet }: PetSelectedProps) {
  return (
    <div className="mt-2 p-4 border border-myPurple-tertiary/50 rounded-lg bg-slate-50 text-black text-sm flex items-start gap-3">
      <div className="bg-myPurple-primary/20 p-2 rounded-full">
        <PawPrint className="h-5 w-5 text-myPurple-primary" />
      </div>
      <div>
        <p className="font-medium text-base text-myPurple-focus">{pet.name}</p>
        <p className="text-gray-600">Raza: {pet.race.name}</p>
      </div>
    </div>
  )
}
