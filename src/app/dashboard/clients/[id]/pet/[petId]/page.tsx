import PetVaccinationTable from "@/components/petUI/PetVaccinationTable";
import authOptions from "@/lib/auth/options";
import { getPetById } from "@/lib/pets/getPetById";
import { PetData } from "@/lib/pets/IPet";
import { calcularEdad } from "@/lib/utils";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { notFound } from "next/navigation";

export default async function Page(
    { params }: { params: Promise<{ petId: string }> }
) {
    const resolvedParams = await params;
    const petId = Number(resolvedParams.petId);
    const session = await getServerSession(authOptions);
    const token = session?.user?.token || "";
    const pet = await getPetById(petId, token) as PetData;
    if(!pet) return notFound();
    return <div className="py-4">
        <section className="flex flex-wrap items-center gap-4 px-16 mx-auto md:gap-16 md:px-24 py-12">
              <Image
                src={"/pelu1.png"}
                alt={pet.name}
                width={250}
                height={250}
                className="w-[250px] h-[250px] rounded-full object-cover"
              />
              <div>
                <h1 className="text-xl md:text-3xl font-bold text-gray-800">
                  {pet.name}
                </h1>
                <p className=" text-gray-600 text-wrap">Raza : {pet.race.name}</p>
                <p className=" text-gray-600 text-wrap">Sexo : {pet.sex}</p>
                <p className=" text-gray-600 text-wrap">Peso : {pet.weight} kg</p>
                <p className=" text-gray-600 text-wrap">Edad : {calcularEdad(pet.dateOfBirth)}</p>
              </div>
        </section>
        <section className="flex-col flex-wrap items-center gap-4 px-16 mx-auto md:gap-16 md:px-24">
        <h2 className="text-2xl font-bold mb-3">Control de Vacunas</h2>
        <PetVaccinationTable token={token} petId={petId} />
        </section>
    </div>
    }