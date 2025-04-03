import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth/options";
import { notFound } from "next/navigation";
import { getProviderById } from "@/lib/provider/getProviderById";
import ProviderForm from "@/components/admin/provider/ProviderForm";

export default async function EditProviderPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const token = session?.user?.token || null;

  if (!token) {
    notFound();
  }

  const providerId = parseInt(params.id, 10);
  if (isNaN(providerId)) {
    notFound();
  }

  const provider = await getProviderById(providerId, token);
  if (!provider) {
    notFound();
  }

  return (
    <div className="p-4">
      <ProviderForm token={token} initialData={provider} />
    </div>
  );
}
