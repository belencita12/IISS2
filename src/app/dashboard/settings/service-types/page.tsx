import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth/options";
import { redirect } from "next/navigation";
import ServiceTypeList from "@/components/admin/settings/service-types/ServiceTypeList";

export default async function ServiceTypesPage() {
  const session = await getServerSession(authOptions);
  const token = session?.user?.token || null;

  if (!token) {
    redirect("/login");
  }

  return (
    <div className="p-6">
      <ServiceTypeList token={token} />
    </div>
  );
} 