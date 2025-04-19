import PurchaseDetail from "@/components/admin/purchases/PurchaseDetail";
import authOptions from "@/lib/auth/options";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import { getPurchaseById } from "@/lib/purchase/getPurchaseDetailById";
import { getPurchaseDetailByPurchaseId } from "@/lib/purchase/getPurchaseDetailByPurchaseId";

export default async function PurchaseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const purchaseId = Number(resolvedParams.id);
  
  if (isNaN(purchaseId)) return notFound();

  const session = await getServerSession(authOptions);
  if (!session) return redirect("/login");
  const token = session.user.token as string;

  // Primero obtener la compra
  const purchase = await getPurchaseById(resolvedParams.id, token).catch(() => null);
  
  // Si no existe la compra, mostrar 404
  if (!purchase) return notFound();
  
  // Una vez que tengamos la compra, buscamos los detalles
  const detailResp = await getPurchaseDetailByPurchaseId(resolvedParams.id, 1, token).catch(() => null);
  
  // Si no hay detalles para esta compra, mostrar 404
  if (!detailResp || !detailResp.data || detailResp.data.length === 0) return notFound();

  return <PurchaseDetail token={token} purchaseInfo={purchase} />;
}