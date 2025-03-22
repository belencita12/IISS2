import DepositInfo from "@/components/depositUI/DepositInfo";
import ProductList from "@/components/productUi/ProductList";
import { getServerSession } from "next-auth/next";
import authOptions from "@/lib/auth/options";

export default async function Page({ params, }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return <p>No autorizado</p>;

  const { id } = await params;
  if (!id) return <p>ID de depósito no proporcionado</p>;
  const depositoId = Number(id);
  if (isNaN(depositoId)) return <p>ID de depósito no válido</p>;

  const token = session.user.token;

  return (
    <div className="flex justify-center">
      <div className="w-full space-y-4 mt-4">
        <DepositInfo token={token} depositoId={depositoId} />
        <ProductList token={token} depositoId={depositoId} />
      </div>

    </div>
  );
}