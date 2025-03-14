import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import { Pencil, Trash } from "lucide-react";
  import Image from "next/image";
  import { Button } from "@/components/ui/button";
  
  const pets = [
    {
      id: 1,
      name: "El gato",
      species: "Gato",
      breed: "Mestizo",
      image: "/image (4).png",
    },
    {
      id: 2,
      name: "Megatron",
      species: "Perro",
      breed: "Caniche",
      image: "/image 26.png",
    },
  ];
  
  export default function PetsTable() {
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
                  src={pet.image}
                  alt={pet.name}
                  width={30}
                  height={30}
                  className="rounded-full"
                />
              </TableCell>
              <TableCell className="font-medium">{pet.name}</TableCell>
              <TableCell>{pet.species}</TableCell>
              <TableCell>{pet.breed}</TableCell>
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
  