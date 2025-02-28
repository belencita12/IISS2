import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
const pets = [
    {
        name: "Rufo",
        breed: "Pastor Alemán",
        age: "7 años",
        image: "https://images.unsplash.com/photo-1560807707-8cc77767d783"
    },
    {
        name: "Mangle Gordo Bello",
        breed: "No especificada",
        age: "5 años",
        image: "https://images.unsplash.com/photo-1574158622682-e40e69881006"
    },
    {
        name: "Luna",
        breed: "Bulldog Francés",
        age: "3 años",
        image: "https://images.unsplash.com/photo-1574158622682-e40e69881006"
    },
    {
        name: "Toby",
        breed: "Chihuahua",
        age: "2 años",
        image: "https://images.unsplash.com/photo-1574158622682-e40e69881006"
    },
    {
        name: "Bella",
        breed: "Golden Retriever",
        age: "4 años",
        image: "https://images.unsplash.com/photo-1560807707-8cc77767d783"
    },
    {
        name: "Max",
        breed: "Rottweiler",
        age: "6 años",
        image: "https://images.unsplash.com/photo-1560807707-8cc77767d783"
    },
    {
        name: "Rocky",
        breed: "Pitbull",
        age: "5 años",
        image: "https://images.unsplash.com/photo-1560807707-8cc77767d783"
    },
    {
        name: "Coco",
        breed: "Poodle",
        age: "4 años",
        image: "https://images.unsplash.com/photo-1574158622682-e40e69881006"
    },
];

export const PetsList = () => {
    return (
        <section className="max-w-5xl mx-auto mt-10 p-6 bg-white flex flex-col items-center justify-center">
            <h3 className="text-3xl font-bold mt-2 text-center">Tus Mascotas Registradas</h3>
            <p className="text-gray-500 mt-2 text-center">Administra la información de tus mascotas</p>
            <Button variant="outline" className="border border-black mt-4">
                <Link href="/">Agregar Mascota</Link>
            </Button>

            <div className="mt-8 w-full max-w-[57rem]">
                <ScrollArea className="w-full overflow-x-auto" type="always">
                    <div className="flex items-center gap-6 mt-2 w-max">
                        {pets.map((pet, index) => (
                            <div key={index} className="text-center w-48 flex-shrink-0">
                                <Avatar className="w-24 h-24 mx-auto">
                                    <AvatarImage src={pet.image} alt={pet.name} className="rounded-lg" />
                                </Avatar>
                                <p className="font-semibold mt-2 text-lg">{pet.name}</p>
                                <p className="text-sm text-gray-500">{pet.breed}</p>
                                <p className="text-2xl font-bold mt-2">{pet.age}</p>
                            </div>
                        ))}
                    </div>
                    <div className="h-4"></div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </div>
        </section>
    );
};
