// app/admin/purchases/page.tsx (o donde lo tengas)
import PurchaseList from "@/components/admin/purchases/PurchaseList";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth/options";
import { redirect } from "next/navigation";

export default async function PurchasesPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    const token = session?.user?.token || "";

    return (
        <div className="mx-auto p-6">
            <PurchaseList token={token} />
        </div>
    );
}
