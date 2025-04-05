import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth/options";
import { redirect } from "next/navigation";
import ProviderForm from "@/components/admin/provider/ProviderForm"; // Ajustá la ruta si es diferente

export default async function NewProviderPage() {
  const session = await getServerSession(authOptions);
  const token = session?.user?.token || null;

  if (!token) {
    redirect("/login");
  }

  return (
    <div>
      <ProviderForm token={token} />
    </div>
  );
}
