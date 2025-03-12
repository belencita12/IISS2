import ClientList from "@/components/admin/ClientList";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth/options";
import { Header } from "@/components/admin/Header";
import { redirect } from "next/navigation";

export default async function ClientesPage() {

    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    return (
        <div>
            <Header fullName={session?.user.fullName} />
            <ClientList />
        </div>
    );
};

