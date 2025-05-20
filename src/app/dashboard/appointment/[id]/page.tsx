import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth/options";
import { redirect } from "next/navigation";
import AppointmentDetail from "@/components/admin/appointment/AppointmentDetail";

export default async function AppointmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const { id } = await params;
  const token = session?.user?.token || null;

  return (
    <div className="container mx-auto p-4">
      <AppointmentDetail token={token} appointmentId={id} />
    </div>
  );
}