import { getInvoiceById } from "@/lib/invoices/getInvoiceById";
import { getInvoiceDetail } from "@/lib/invoices/getInvoiceDetail";
import InvoiceDetail from "@/components/admin/invoices/InvoiceDetail";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth/options";
import { notFound, redirect } from "next/navigation";

export default async function InvoiceDetailPage({ params: { id } }: { params: { id: string } }) {
  const invoiceId = Number(id);
  if (isNaN(invoiceId)) return notFound();

  const session = await getServerSession(authOptions);
  if (!session) return redirect("/login");
  const token = session.user.token as string;

  const [invoice, detailResp] = await Promise.all([
    getInvoiceById(id, token).catch(() => null),
    getInvoiceDetail(id, token).catch(() => null),
  ]);

  if (!invoice || !detailResp?.data?.length) return notFound();

  return <InvoiceDetail token={token} />;
}
