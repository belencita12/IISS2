import RaceList from "@/components/admin/settings/races/RaceList";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth/options";
import { redirect } from "next/navigation";

export default async function RacePage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    const token = session?.user?.token || null;

    return (
        <div>
            <RaceList token={token} />
        </div>
    );
};

