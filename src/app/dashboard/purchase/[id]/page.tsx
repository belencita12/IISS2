import PurchaseDetail from "@/components/admin/purchase/PurchaseDetail";
import authOptions from "@/lib/auth/options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function PurchaseDetailPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    const token = session.user.token;
    return <PurchaseDetail token={token} />;
  }

  redirect("/login");
}