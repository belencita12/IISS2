import InvoiceDetail from "@/components/admin/invoices/InvoiceDetail";
import authOptions from "@/lib/auth/options";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import { getInvoiceById } from "@/lib/invoices/getInvoiceById";
import { getInvoiceDetail } from "@/lib/invoices/getInvoiceDetail";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const invoiceId = Number(resolvedParams.id);
  
  // Validación de ID numérico
  if (isNaN(invoiceId)) return notFound();
  
  // Validación de sesión
  const session = await getServerSession(authOptions);
  if (!session) return redirect("/login");
  
  const token = session.user.token as string;
  
  // Obtener la factura principal
  const invoice = await getInvoiceById(resolvedParams.id, token).catch(() => null);
  if (!invoice) return notFound();
  
  // Obtener detalles de la factura
  const detailResp = await getInvoiceDetail(invoiceId.toString(), token).catch(() => null);
  if (!detailResp || !detailResp.data || detailResp.data.length === 0) return notFound();
  
  // Si pasó todas las validaciones, renderizar el componente
  return (
    <div className="relative">
      <div className="absolute my-2 -top-14 left-4 z-50">
        <Link href="/dashboard/invoices">
          <Button
            variant="outline"
            className="px-6 border-gray-200 border-solid"
          >
            Volver
          </Button>
        </Link>
      </div>
      <div className="mt-28">
        <InvoiceDetail token={token} />
      </div>
    </div>
  );
}