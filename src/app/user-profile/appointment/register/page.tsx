import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth/options";
import { redirect } from "next/navigation";
import { AppointmentForm } from "@/components/profile/appointment/register/AppointmentForm";

export default async function AppointmentsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const token = session.user?.token || "";
  const userId = session.user?.id;
  const userRole = Array.isArray(session.user?.roles) ? session.user.roles.join(", ") : session.user?.roles || ""; // Convertir roles a una cadena

  if (!userId) {
    redirect("/login"); // o mostrar un error
  }

  return (
    <div className="mx-auto justify-center items-center flex flex-col p-4">
      <h1 className="text-3xl font-bold mt-6">Agendar Cita</h1>
      <AppointmentForm token={token} clientId={userId} userRole={userRole} />
    </div>
  );
}
