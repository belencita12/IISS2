import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth/options";
import { redirect } from "next/navigation";
import NewVaccineForm from "@/components/admin/vaccine/NewVaccineForm";

export default async function NewVaccinePage() {
    const session = await getServerSession(authOptions);
    const token = session?.user?.token || null;

    if (!token) {
        redirect("/login");
    }

    return (
        <div>
            <NewVaccineForm token={token} />
        </div>
    );
}