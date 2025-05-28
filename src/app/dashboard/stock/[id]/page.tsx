import DepositDetails from "@/components/deposit/DepositDetails";
import { getServerSession } from "next-auth/next";
import authOptions from "@/lib/auth/options";

export default async function Page({ params, }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return <p>No autorizado</p>;

  const { id } = await params;
  if (!id) return <p>ID de depósito no proporcionado</p>;
  if (isNaN(Number(id))) return <p>ID de depósito no válido</p>;

  const token = session.user.token;

  return (
      <div className="space-y-4">
        <DepositDetails token={token} stockId={id} />
      </div>
  );
}