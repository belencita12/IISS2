import AppointmentDetails from "@/components/profile/appointment/AppointmentDetails";
import authOptions from "@/lib/auth/options";
import { getServerSession } from "next-auth/next";
import { redirect, notFound } from "next/navigation";

interface PageProps {
    params: Promise<{id: string;}>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Page({ params, }: { params: Promise<{id: string}>}) {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");
    
    const { id } = await params;

    if (!id) {
        return (
            <div className="flex justify-center items-center min-h-[200px]">
                <p className="text-red-500">ID de cita no proporcionado</p>
            </div>
        );
    }

    if (isNaN(Number(id))) {
        return (
            <div className="flex justify-center items-center min-h-[200px]">
                <p className="text-red-500">ID de cita no válido</p>
            </div>
        );
    }

    const token = session.user.token;
      
    return (
        <div className="flex justify-center">
            <div className="w-4/5 space-y-4 mt-4">
                <AppointmentDetails token={token} appointmentId={id} />
            </div>
        </div>
    );
}