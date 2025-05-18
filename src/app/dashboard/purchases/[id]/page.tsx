import PurchaseDetail from "@/components/admin/purchases/PurchaseDetail";
import authOptions from "@/lib/auth/options";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import { getPurchaseById } from "@/lib/purchases/getPurchaseDetailById";
import { getPurchaseDetailByPurchaseId } from "@/lib/purchases/getPurchaseDetailByPurchaseId";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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

  return (
    <div className="relative">
      <div className="absolute my-2 -top-6 left-4 z-50">
        <Link href="/dashboard/purchases">
          <Button
            variant="outline"
            className="px-6 border-gray-200 border-solid"
          >
            Volver
          </Button>
        </Link>
      </div>
      <div className="mt-20">
        <PurchaseDetail token={token} purchaseInfo={purchase} />
      </div>
    </div>
  );
}