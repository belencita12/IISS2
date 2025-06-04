import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth/options";
import { redirect } from "next/navigation";
import AppointmentDetail from "@/components/admin/appointment/AppointmentDetail";
import { CurrentAppointmentProvider } from "@/context/appointment/CurrentApointment";

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
      <CurrentAppointmentProvider>
        <AppointmentDetail token={token} appointmentId={id} />
      </CurrentAppointmentProvider>
    </div>
  );
}
