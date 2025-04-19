import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import authOptions from "@/lib/auth/options";
import EditClientForm from "@/components/admin/client/EditClientForm";


export default async function EditClientPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    const token = session.user.token;
    const resolvedParams = await params; 
    const clientId = resolvedParams.id;

    return <EditClientForm token={token} clientId={clientId} />;
} 