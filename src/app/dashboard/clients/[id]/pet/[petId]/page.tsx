import PetVaccinationTable from "@/components/pet/PetVaccinationTable";
import authOptions from "@/lib/auth/options";
import { getPetById } from "@/lib/pets/getPetById";
import { calcularEdad } from "@/lib/utils";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getClientById } from "@/lib/client/getClientById";

export default async function Page(
    { params }: { params:{ id: string; petId: string } }
) {
    const petId = Number(params.petId);
    const clientId = Number(params.id);
    const session = await getServerSession(authOptions);
    const token = session?.user?.token || "";
    
    try {
        // Primero verificamos si el cliente existe
        const client = await getClientById(clientId, token);
        if (!client) {
            return notFound();
        }

        // Luego verificamos si la mascota existe
        const pet = await getPetById(petId, token);
        if (!pet) {
            return notFound();
        }

        return <div className="py-4">
            <section className="flex flex-wrap items-center gap-4 px-16 mx-auto md:gap-16 md:px-24 py-12">
                <Image
                    src={pet.profileImg?.originalUrl || "/imagen-mascota/default.jpg"}
                    alt={pet.name}
                    width={250}
                    height={250}
                    className="w-[250px] h-[250px] rounded-full object-cover"
                />
                <div>
                    <h1 className="text-xl md:text-3xl font-bold text-gray-800">
                        {pet.name}
                    </h1>
                    <p className="text-gray-600 text-wrap">Raza : {pet.race?.name || 'No especificada'}</p>
                    <p className="text-gray-600 text-wrap">Sexo : {pet.sex || 'No especificado'}</p>
                    <p className="text-gray-600 text-wrap">Peso : {pet.weight || '0'} kg</p>
                    <p className="text-gray-600 text-wrap">Edad : {pet.dateOfBirth ? calcularEdad(pet.dateOfBirth) : 'No especificada'}</p>
                </div>
            </section>
            <section className="flex-col flex-wrap items-center gap-4 px-16 mx-auto md:gap-16 md:px-24">
                <h2 className="text-2xl font-bold mb-3">Control de Vacunas</h2>
                <PetVaccinationTable token={token} petId={petId} />
            </section>
        </div>
    } catch (error) {
        return notFound();
    }
}