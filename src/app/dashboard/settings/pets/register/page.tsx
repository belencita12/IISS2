import PetRegisterForm from "@/components/admin/settings/pets/register/PetForm";
import authOptions from "@/lib/auth/options";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

export default async function PetRegisterPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    const token = session.user.token;

    return (
        <div>
            <PetRegisterForm token={token} />
        </div>
    );
}
