import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth/options";
import { redirect } from "next/navigation";

export default async function PositionsPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    const token = session?.user?.token || null;

    return (
        <div className="flex flex-col justify-between items-center gap-4 p-6">
            {/* Cambiar h1 por el componente a implementar */}
            <h1 className="text-2xl font-bold">Puestos</h1>
        </div>
    );
}