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
    <div className="mx-auto justify-center items-center flex flex-col p-4">
      <h1 className="text-3xl font-bold mt-6">Registrar Cita</h1>
      <AppointmentForm token={token} />
    </div>
  );
}
