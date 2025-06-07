import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth/options";
import { redirect } from "next/navigation";

import HelpData from "@/components/admin/help/HelpData";

export default async function helpPage() {
    const session = await getServerSession(authOptions);
    const token = session?.user?.token || null;

    if (!token) {
        redirect("/login");
    }

    return (
        <div>
            <HelpData/>
        </div>
    );
}