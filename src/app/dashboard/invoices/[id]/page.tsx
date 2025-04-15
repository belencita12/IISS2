import InvoiceDetail from "@/components/admin/invoices/InvoiceDetail";
import authOptions from "@/lib/auth/options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function InvoiceDetailPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    const token = session.user.token;
    return <InvoiceDetail token={token} />;
  }

  redirect("/login");
}

