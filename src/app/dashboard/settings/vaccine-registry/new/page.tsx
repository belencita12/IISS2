import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth/options";
import { redirect } from "next/navigation";
import VaccineRegistryForm from "@/components/admin/vaccine-registry/VaccineRegistryForm";

export default async function NewVaccineRegistryPage() {
  const session = await getServerSession(authOptions);
  const token = session?.user?.token || null;

  if (!token) {
    redirect("/login");
  }

  return (
    <VaccineRegistryForm token={token} />
  );
}
