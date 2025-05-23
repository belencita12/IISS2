import {
    Table,
    TableBody,
      TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import { Pencil, Trash } from "lucide-react";
  import Image from "next/image";
  import { Button } from "@/components/ui/button";
  import { PetData } from "@/lib/pets/IPet";
  
  export default function PetsTable(
    { pets }: { pets: PetData[] }
  ) {
    if(pets.length === 0) return <p className="text-center">No hay mascotas</p>
    return (
      <Table>
        <TableHeader>
          <TableRow className="bg-[#E9EAEF]">
            <TableHead className="w-[50px]"> </TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Especie</TableHead>
            <TableHead>Raza</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pets.map((pet) => (
            <TableRow key={pet.id}>
              <TableCell>
                <Image
                  src={pet.profileImg?.previewUrl || "/image (4).png"}
                  alt={pet.name}
                  width={30}
                  height={30}
                  className="rounded-full"
                />
              </TableCell>
              <TableCell className="font-medium">{pet.name}</TableCell>
              <TableCell>{pet.species.name}</TableCell>
              <TableCell>{pet.race.name}</TableCell>
              <TableCell className="text-right flex gap-2 justify-end">
                <Button variant="ghost" size="icon">
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Trash className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }
  