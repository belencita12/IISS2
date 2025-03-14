import authOptions from "@/lib/auth/options";
import { getServerSession, } from "next-auth";
import ClientProfileSection from "@/components/admin/client/ClientProfileSection";
import PetsTable from "@/components/admin/pet/PetsTable";
import { Button } from "@/components/ui/button";
import { getPetsByUserId } from "@/lib/pets/getPetsByUserId";
import { PetData } from "@/lib/pets/IPet";

export default async function ClientDetails(
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    const token = session?.user?.token || "";
    const resolvedParams = await params; 
    const { id } = resolvedParams;
    const client = {
        fullName: "Lindsey Stroud",
        image: "/userProfile.png",
        email: "lindsey.stroud.@example.com",
    };

    const pets = await getPetsByUserId(Number(id), token) as PetData[];

    return (
        <>
            <ClientProfileSection {...client} />
            <section className="mx-auto px-24">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl">Mascotas</h2>
                    <Button variant={"outline"} className="border-black border-solid">Agregar</Button>
                </div>
                <PetsTable pets={pets}/>
            </section>
        </>
    );
}
