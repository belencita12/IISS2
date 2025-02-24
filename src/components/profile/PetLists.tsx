import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

const pets = [
    { name: "Rufo", breed: "Pastor Alemán", age: "7 años", image: "/mascota1.jpg" },
    { name: "Mangle Gordo Bello", breed: "No especificada", age: "5 años", image: "/mascota2.jpg" },
];

export const PetsList = () => (
    <section className="mt-6">
        <h3 className="text-xl font-semibold">Tus Mascotas Registradas</h3>
        <Button className="mt-2">Agregar Mascota</Button>
        <div className="flex gap-4 mt-4">
            {pets.map((pet, index) => (
                <Card key={index} className="p-4 text-center">
                    <Avatar className="w-12 h-12 mx-auto">
                        <AvatarImage src={pet.image} alt={pet.name} />
                    </Avatar>
                    <p className="font-semibold">{pet.name}</p>
                    <p className="text-sm text-gray-500">{pet.breed}</p>
                    <p className="text-sm font-semibold">{pet.age}</p>
                </Card>
            ))}
        </div>
    </section>
);
