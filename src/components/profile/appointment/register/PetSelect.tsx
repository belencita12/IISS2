"use client"

import { useEffect, useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { PetData } from "@/lib/pets/IPet"
import { PET_API } from "@/lib/urls"
import { useFetch } from "@/hooks/api"

type PetSelectProps = {
  clientId: number
  token: string
  onSelectPet: (pet: PetData) => void
}

type PetResponse = {
  data: PetData[]
}

export default function PetSelect({ clientId, token, onSelectPet }: PetSelectProps) {
  const [pets, setPets] = useState<PetData[]>([])
  const { data, get } = useFetch<PetResponse>("", token)

  useEffect(() => {
    if (clientId) {
      get(undefined, `${PET_API}?clientId=${clientId}&page=1&size=100`)
    }
  }, [clientId])

  useEffect(() => {
    if (data?.data) {
      setPets(data.data)
    }
  }, [data])

  const handleSelect = (petId: string) => {
    const selectedPet = pets.find((p) => p.id === Number(petId))
    if (selectedPet) {
      onSelectPet(selectedPet)
    }
  }

  return (
    <div className="space-y-2">
      <Select onValueChange={handleSelect}>
        <SelectTrigger className="w-full border-myPurple-tertiary focus:ring-myPurple-focus">
          <SelectValue placeholder="Selecciona una mascota" />
        </SelectTrigger>
        <SelectContent>
          {pets.map((pet) => (
            <SelectItem key={pet.id} value={String(pet.id)}>
              <div>
                <p>{pet.name}</p>
                <p className="text-sm text-muted-foreground">{pet.race.name}</p>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
