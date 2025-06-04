import AppointmentList from "@/components/admin/appointment/AppointmentList";
import { CurrentAppointmentProvider } from "@/context/appointment/CurrentApointment";
import authOptions from "@/lib/auth/options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function AppointmentListPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    const token = session.user.token;
    return (
      <CurrentAppointmentProvider>
        <div className="mx-auto">
          <AppointmentList token={token} />
        </div>
      </CurrentAppointmentProvider>
    );
  }

  redirect("/login");
}
