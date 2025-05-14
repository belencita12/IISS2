import authOptions from "@/lib/auth/options";
import { getServerSession } from "next-auth";
import ClientProfileSection from "@/components/admin/client/ClientProfileSection";
import { Button } from "@/components/ui/button";
import { getClientById } from "@/lib/client/getClientById";
import { IUserProfile } from "@/lib/client/IUserProfile";
import PaginatedPetsTable from "@/components/admin/pet/PaginatedPetsTable";
import { notFound } from "next/navigation";
import Link from "next/link";
import ClientAppointmentList from "@/components/admin/appointment/AppointmentListByClient"; // ✅ asegúrate de que el path sea correcto


export default async function ClientDetails(
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    const token = session?.user?.token || "";
    const clientId = Number(id);
    if (isNaN(clientId)) return notFound();
    
    const client = await getClientById(clientId, token) as IUserProfile;
    if (!client) {
        return notFound();
    }

    return (
        <>

            <ClientProfileSection {...client} />

            <section className="mx-auto mt-10 px-1 md:px-24">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl">Mascotas</h2>
                    <div className="flex gap-3">
                        <Link href="/dashboard/clients">
                            <Button variant="outline" className="border-black border-solid">
                                Volver
                            </Button>
                        </Link>
                        <Link href={`/dashboard/clients/${id}/pet/register`}>
                            <Button variant="outline" className="border-black border-solid">
                                Agregar
                            </Button>
                        </Link>
                    </div>
                </div>
                <PaginatedPetsTable token={token} id={clientId} />
            </section>

            <section className="mx-auto px-1 md:px-24 mt-10">
                <h2 className="text-xl font-semibold mb-4">Citas del Cliente</h2>
                <ClientAppointmentList token={token} clientRuc={client.ruc} />
            </section>
        </>
    );
}
