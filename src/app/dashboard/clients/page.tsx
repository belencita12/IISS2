import ClientList from "@/components/admin/ClientList";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth/options";
import { redirect } from "next/navigation";

export default async function ClientesPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    const token = session?.user?.token || null;

    return (
        <div>
            <ClientList token={token} />
        </div>
    );
};

