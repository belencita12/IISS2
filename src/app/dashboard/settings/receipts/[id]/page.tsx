import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth/options";
import ReceiptDetail from "@/components/admin/settings/receipts/ReceiptDetails";
import { redirect, notFound } from "next/navigation";
import { getReceiptById } from "@/lib/receipts/getReceiptById";

export default async function ReceiptDetailPage(
    { params, } : 
    {params: Promise<{ id: string }>
}) {
  const session = await getServerSession(authOptions);
  const { id } = await params;
  
  const token = session?.user?.token || null;
  if (!token) {
    redirect("/login");
  }

  const receipt = await getReceiptById(id, token).catch(() => null);
  if(!receipt) {
    notFound();
  }

  return (
    <div>
        <ReceiptDetail id={id} token={token} />
    </div>);
}