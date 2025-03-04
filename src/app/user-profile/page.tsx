import { Appointments } from "@/components/profile/Appointments";
import { Header } from "@/components/profile/Header";
import { PetsList } from "@/components/profile/PetLists";
import { VeterinaryProducts } from "@/components/profile/Product";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth/options"

export default async function Profile() {
    const session = await getServerSession(authOptions);
    const fullName = session?.user?.fullName;

    console.log("Sesión:", { fullName });

    return (
        <div>
            <Header fullName={fullName} />
            <PetsList />
            <Appointments/>
            <VeterinaryProducts />
        </div>
    );
}
