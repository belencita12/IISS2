import authOptions from "@/lib/auth/options";
import { getServerSession } from "next-auth";
import ClientProfileSection from "@/components/admin/client/ClientProfileSection";
import { Button } from "@/components/ui/button";
import { getClientById } from "@/lib/client/getClientById";
import { IUserProfile } from "@/lib/client/IUserProfile";
import PaginatedPetsTable from "@/components/admin/pet/PaginatedPetsTable";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function ClientDetails(
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);
    const token = session?.user?.token || "";
    const id = Number(params.id);
    if (isNaN(id)) return notFound();
    const client = await getClientById(id, token) as IUserProfile;
    if (!client) {
        //console.error(`Cliente con id ${id} no encontrado`);
        return notFound();
      }
    
    return (
        <>
            <ClientProfileSection {...client} />
            <section className="mx-auto px-1 md:px-24">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl">Mascotas</h2>
                    <Link href={`/dashboard/clients/${id}/pet/register`}>
                        <Button variant={"outline"} className="border-black border-solid">Agregar</Button>
                    </Link>
                </div>
                    <PaginatedPetsTable token={token} id={id}/>
            </section>
        </>
    );
}
