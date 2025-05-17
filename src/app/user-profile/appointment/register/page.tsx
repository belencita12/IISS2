import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth/options";
import { redirect } from "next/navigation";
import { AppointmentForm } from "@/components/appointment/register/AppointmentForm";

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
    <div>
      <AppointmentForm token={token} clientId={userId} userRole={userRole} />
    </div>
  );
}
