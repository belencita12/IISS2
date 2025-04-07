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
    if(!user?.clientId) return notFound();

    const clientProfile = await getClientById(user.clientId, user.token);

    if(!clientProfile) return notFound();
    return (
        <div>
            <Header user={clientProfile} />
            <PetsList clientId={user.clientId} token={user?.token} />
            <Appointments />
            <VeterinaryProducts />
        </div>
    );
}
