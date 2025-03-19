// app/dashboard/vaccine/edit/[id]/page.tsx
import EditVaccinePage from "@/components/admin/vaccine/EditVaccinePage";
import authOptions from "@/lib/auth/options";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; // Esperamos la resolución de params (similar a await params en el ejemplo de slug)
  
  const session = await getServerSession(authOptions);
  const token = session?.user?.token || null;
  
  if (!token) {
    notFound();
  }
  
  return <EditVaccinePage token={token} id={id} />;
}
