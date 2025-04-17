import InvoiceDetail from "@/components/admin/invoices/InvoiceDetail";
import authOptions from "@/lib/auth/options";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import { getInvoiceById } from "@/lib/invoices/getInvoiceById";
import { getInvoiceDetail } from "@/lib/invoices/getInvoiceDetail";


export default async function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const invoiceId = Number(resolvedParams.id);
  
  if (isNaN(invoiceId)) return notFound();

  const session = await getServerSession(authOptions);
  if (!session) return redirect("/login");
  const token = session.user.token as string;

  // Primero obtener la factura
  const invoice = await getInvoiceById(resolvedParams.id, token).catch(() => null);
  
  // Si no existe la factura, mostrar 404
  if (!invoice) return notFound();
  
  // Una vez que tengamos la factura, buscamos los detalles usando su invoiceNumber
  const detailResp = await getInvoiceDetail(invoice.invoiceNumber, token).catch(() => null);
  
  // Si no hay detalles para esta factura, mostrar 404
  if (!detailResp || !detailResp.data || detailResp.data.length === 0) return notFound();

  return <InvoiceDetail token={token} />;
}