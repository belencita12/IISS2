import { Header } from "@/components/profile/Header";
import authOptions from "@/lib/auth/options";
import { getServerSession, } from "next-auth";
import ClientProfileSection from "@/components/admin/client/ClientProfileSection";
import PetsSection from "@/components/admin/pet/PetsSection";

type ClientDetailsProps = {
    params: {
        id: string;
    };
};

export default async function ClientDetails() {
    const token = await getServerSession(authOptions);
    const fullName = token?.user?.fullName || "User";
    const client = {
        fullName: "Lindsey Stroud",
        image: "/userProfile.png",
        email: "lindsey.stroud.@example.com",
    };

    return (
        <>
            <Header fullName={fullName} />
            <ClientProfileSection {...client} />
            <PetsSection />
        </>
    );
}
