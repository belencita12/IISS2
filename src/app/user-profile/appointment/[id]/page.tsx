import AppointmentDetails from "@/components/appointment/AppointmentDetails";
import authOptions from "@/lib/auth/options";
import { getServerSession } from "next-auth/next";

export default async function Page({ params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session) return <p>No autorizado</p>;
    
    const { id } = await params;
    if (!id) return <p>ID de cita no proporcionado</p>;
      if (isNaN(Number(id))) return <p>ID de cita no válido</p>;
    const token = session.user.token;
      
    return (
        <div className="flex justify-center">
            <div className="w-4/5 space-y-4 mt-4">
                <AppointmentDetails token={token} appointmentId={id} />
            </div>
        </div>
    );
  }