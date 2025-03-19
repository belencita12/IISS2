import EditVaccinePage from "@/components/admin/vaccine/EditVaccinePage";
import authOptions from "@/lib/auth/options";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";

export default async function Page(context: { params: { id: string } }) {
  const params = await Promise.resolve(context.params);
  const id = params.id;

  const session = await getServerSession(authOptions);
  const token = session?.user?.token || null;

  if (!token) {
    notFound();
  }

  return <EditVaccinePage token={token} id={id} />;
}