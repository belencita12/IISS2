import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth/options";
import StockForm from "@/components/stock/register/StockForm";

export default async function StockPage() {
  const session = await getServerSession(authOptions);
  const token = session?.user?.token || "";

  if (!token) return <p>Cargando...</p>;

  return (
    <main className="py-6 px-20">
      <StockForm token={token} />
    </main>
  );
}