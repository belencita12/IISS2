import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth/options";
import { redirect } from "next/navigation";
import VaccineManufacturerForm from "@/components/admin/vaccine-manufacturer/VaccineManufacturerForm";

export default async function NewVaccineManufacturerPage() {
    const session = await getServerSession(authOptions);
    const token = session?.user?.token || null;

    if (!token) {
        redirect("/login");
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Crear Fabricante de Vacunas</h1>
            <VaccineManufacturerForm token={token} />
        </div>
    );
}