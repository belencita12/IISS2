import type { PetData } from "@/lib/pets/IPet"
import { PawPrint } from "lucide-react"

type PetSelectedProps = {
  pet: PetData
}

export default function PetSelected({ pet }: PetSelectedProps) {
  return (
    <div className="flex items-center p-3">
      <div className="bg-white p-2 rounded-full mr-3">
        <PawPrint className="h-5 w-5 text-myPurple-primary" />
      </div>
      <div>
        <p className="font-medium text-myPurple-focus">{pet.name}</p>
        <p className="text-gray-600">Raza: {pet.race.name}</p>
      </div>
    </div>
  )
}
