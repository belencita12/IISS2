import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

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
];

export const PetsList = () => (
    <section className="max-w-6xl mx-auto mt-10 flex items-center justify-center gap-12">
        <div className="w-1/1">
            <h3 className="text-3xl font-bold mt-2">Tus Mascotas Registradas</h3>
            <p className="text-gray-500 mt-2">Administra la información de tus mascotas</p>

            <Button className="border border-black text-black bg-white hover:bg-gray-100 mt-4">
                Agregar Mascota
            </Button>

            <div className="flex items-center gap-10 mt-8">
                {pets.map((pet, index) => (
                    <div key={index} className="text-center">
                        <Avatar className="w-20 h-20 mx-auto">
                            <AvatarImage src={pet.image} alt={pet.name} />
                        </Avatar>
                        <p className="font-semibold mt-2 text-lg">{pet.name}</p>
                        <p className="text-sm text-gray-500">{pet.breed}</p>
                        <p className="text-2xl font-bold mt-2">{pet.age}</p>
                    </div>
                ))}
            </div>
        </div>
        <div className="flex justify-start">
            <img
                src="https://images.unsplash.com/photo-1517423440428-a5a00ad493e8"
                alt="Mascota destacada"
                className="rounded-lg shadow-lg w-[400px] h-[300px] object-cover"
            />
        </div>
    </section>
);
