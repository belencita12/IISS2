import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import authOptions from "@/lib/auth/options"
import PositionForm from "@/components/admin/work-position/PositionForm";

export default async function Position() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }
    const token = session?.user?.token;
    return (
        <div className="max-w-4xl mx-auto p-8">
            <PositionForm token={token}/>
        </div>
    );
}