import authOptions from "@/lib/auth/options";
import { getServerSession } from "next-auth";
import ClientProfileSection from "@/components/admin/client/ClientProfileSection";
import { Button } from "@/components/ui/button";
import { getPetsByUserId } from "@/lib/pets/getPetsByUserId";
import { PetData } from "@/lib/pets/IPet";
import { getClientById } from "@/lib/client/getClientById";
import { IUserProfile } from "@/lib/client/IUserProfile";
import PaginatedPetsTable from "@/components/admin/pet/PaginatedPetsTable";
import { notFound } from "next/navigation";

export default async function ClientDetails(
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    const token = session?.user?.token || "";
    const resolvedParams = await params; 
    const id = Number(resolvedParams.id);
    const client = await getClientById(id, token) as IUserProfile;
    if(!client) return notFound();
    
    return (
        <>
            <ClientProfileSection {...client} />
            <section className="mx-auto px-1 md:px-24">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl">Mascotas</h2>
                    <Button variant={"outline"} className="border-black border-solid">Agregar</Button>
                </div>
                    <PaginatedPetsTable token={token} id={id}/>
            </section>
        </>
    );
}
