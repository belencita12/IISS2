import authOptions from "@/lib/auth/options";
import { getServerSession } from "next-auth";
import { Suspense } from "react";
import ClientProfileSection from "@/components/admin/client/ClientProfileSection";
import PetsTable from "@/components/admin/pet/PetsTable";
import { Button } from "@/components/ui/button";
import { getPetsByUserId } from "@/lib/pets/getPetsByUserId";
import { PetData } from "@/lib/pets/IPet";
import { getClientById } from "@/lib/client/getClientById";
import ClientProfileSectionSkeleton from "@/components/admin/client/skeleton/ClientProfileSectionSkeleton";
import PetsTableSkeleton from "@/components/admin/pet/skeleton/PetsTableSkeleton";

export default async function ClientDetails(
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    const token = session?.user?.token || "";
    const resolvedParams = await params; 
    const { id } = resolvedParams;
    
    return (
        <>
            <Suspense fallback={<ClientProfileSectionSkeleton />}>
                <ClientProfile id={id} token={token} />
            </Suspense>
            
            <section className="mx-auto px-1 md:px-24">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl">Mascotas</h2>
                    <Button variant={"outline"} className="border-black border-solid">Agregar</Button>
                </div>
                <Suspense fallback={<PetsTableSkeleton />}>
                    <PetsTableData id={id} token={token} />
                </Suspense>
            </section>
        </>
    );
}

async function ClientProfile({ id, token }: { id: string, token: string }) {
    const client = await getClientById(Number(id), token);
    return <ClientProfileSection {...client} />;
}

async function PetsTableData({ id, token }: { id: string, token: string }) {
    const pets = await getPetsByUserId(Number(id), token) as PetData[];
    return <PetsTable pets={pets} />;
}