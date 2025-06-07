import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth/options";
import { redirect } from "next/navigation";
import SpeciesList from "@/components/admin/settings/species/SpeciesList";

export default async function SpeciesPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    const token = session?.user?.token || null;

    return (
        <div>
            <SpeciesList token={token} />
        </div>
    );
}