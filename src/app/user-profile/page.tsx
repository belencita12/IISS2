import { Appointments } from "@/components/profile/Appointments";
import { Header } from "@/components/profile/Header";
import { PetsList } from "@/components/profile/PetLists";
import { VeterinaryProducts } from "@/components/profile/Product";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth/options";
import { redirect, notFound } from "next/navigation";
import { getClientById } from "@/lib/client/getClientById";


export default async function Profile() {
    const session = await getServerSession(authOptions);
    console.log("Sesión:", session?.user?.fullName);
    console.log("Sesión:", session?.user?.token);

    if (!session) redirect("/login");

    const user = session?.user;
    
    console.log(user.clientId);
    if(!user?.clientId) return console.log("No hay clientId en la sesión");

    const clientProfile = await getClientById(Number(user.clientId), user.token);

    if(!clientProfile) return console.log("No se encontró el perfil del cliente");

    return (
        <div>
            <Header user={clientProfile} />
            <PetsList clientId={user.clientId} token={user?.token} />
            <Appointments />
            <VeterinaryProducts />
        </div>
    );
}
