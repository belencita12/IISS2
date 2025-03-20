import DepositInfo from "@/components/depositUI/DepositInfo";
import ProductList from "@/components/productUi/ProductList";
import UserBar from "@/components/depositUI/UserBar";
import { getServerSession } from "next-auth/next";
import authOptions from "@/lib/auth/options";

export default async function StockPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return <p>No autorizado</p>;

  const depositoId = Number(params.id);
  if (isNaN(depositoId)) return <p>ID de depósito no válido</p>;

  const token = session.user.token;
  const nombre = session.user.fullName;

  return (
    <div className="flex justify-center">
      <div className="w-4/5 space-y-4">
        <UserBar token={token} nombre={nombre}/>
        <DepositInfo token={token} depositoId={depositoId} />
        <ProductList token={token} depositoId={depositoId} />
      </div>

    </div>
  );
}