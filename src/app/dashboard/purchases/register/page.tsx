import PurchaseForm from "@/components/admin/purchases/PurchaseForm";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth/options";
import { redirect } from "next/navigation";

export default async function CreatePurchasePage() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");

    const token = session?.user?.token;

  return (
    <div>
      <PurchaseForm token={token} />
    </div>
  );
}