
import PositionForm from "@/components/admin/work-position/PositionForm";
import authOptions from "@/lib/auth/options"
import { getPositionById } from "@/lib/work-position/getPositionById";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
export default async function EditPositionPage({ params }: { params: { id: string } } ) {

    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }
    const token = session?.user?.token;
    const resolvedParams = await params;
    const id = Number(resolvedParams.id);
    const position = await getPositionById(id, token);
    console.log('Datos recuperados:', position);

    return (
        <div className="max-w-4xl mx-auto p-8">
            <PositionForm token={token} position={{ ...position, id }} />
        </div>
    );
}