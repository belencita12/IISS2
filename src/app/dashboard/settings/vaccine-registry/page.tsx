import VaccineRegistryList from "@/components/admin/vaccine-registry/VaccineRegistryList";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import authOptions from "@/lib/auth/options";

export default async function Page() {
  const session = await getServerSession(authOptions);
  const token = session?.user?.token;

  if (!token) {
    redirect("/login");
  }

  return <VaccineRegistryList token={token} />;
}
