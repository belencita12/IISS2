import { Appointments } from "@/components/profile/Appointments";
import { Header } from "@/components/profile/Header";
import { PetsList } from "@/components/profile/PetLists";
import { VeterinaryProducts } from "@/components/profile/Product";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth/options";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";

export default async function Profile() {
    const session = await getServerSession(authOptions);
    console.log("Sesión:", session?.user?.fullName);
    console.log("Sesión:", session?.user?.token);

    if (!session) {
        redirect("/login");
    }
    const clientId = session?.user.clientId;
    if(!clientId) return notFound();

    return (
        <div>
            <Header fullName={session?.user?.fullName} />
            <PetsList clientId={clientId} token={session?.user?.token} />
            <Appointments />
            <VeterinaryProducts />
        </div>
    );
}