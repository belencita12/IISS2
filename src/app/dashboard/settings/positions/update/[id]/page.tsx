
import PositionForm from "@/components/admin/work-position/PositionForm";
import authOptions from "@/lib/auth/options"
import { getPositionById } from "@/lib/work-position/getPositionById";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";

export default async function EditPositionPage({ params }: { params: Promise<{ id: string }> }
) {

    const resolvedParams = await params;
    const id = Number(resolvedParams.id);
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }
    const token = session?.user?.token;
    const position = await getPositionById(id, token);
    if(!position) return notFound();

    return (
        <div className="max-w-4xl mx-auto p-8">
            <PositionForm token={token} position={{ ...position, id }} />
        </div>
    );
}
