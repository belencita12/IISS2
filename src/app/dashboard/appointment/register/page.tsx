import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth/options";
import { redirect } from "next/navigation";
import { AppointmentForm } from "@/components/admin/appointment/register/AppointmentForm";

export default async function AppointmentsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const token = session?.user?.token || "";

  return (
    <div >
      <h1 className="text-2xl font-bold mb-6">Registrar nueva cita</h1>
      <AppointmentForm token={token} />
    </div>
  );
}
