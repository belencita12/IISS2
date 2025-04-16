import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import authOptions from "@/lib/auth/options";
import EditClientForm from "@/components/admin/client/EditClientForm";

interface PageProps {
    params: {
        id: string;
    };
}

export default async function EditClientPage({ params }: PageProps) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    const token = session.user.token;
    const clientId = params.id;

    return <EditClientForm token={token} clientId={clientId} />;
} 