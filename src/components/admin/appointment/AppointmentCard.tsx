"use client";

import { AppointmentData } from "@/lib/appointment/IAppointment";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/utils";

interface AppointmentCardProps {
  appointment: AppointmentData;
}

const AppointmentCard = ({ appointment }: AppointmentCardProps) => {
  const router = useRouter();

  const handleViewDetail = () => {
    if (appointment.id) {
      router.push(`/dashboard/appointment/${appointment.id}`);
    }
  };

  console.log(appointment)

  return (
    <div
      onClick={handleViewDetail}
      className="cursor-pointer border p-4 rounded-lg flex justify-between items-start bg-white shadow hover:-translate-y-1 transition-transform duration-300 hover:shadow-md"
    >
      <div>
      <h3 className="font-bold text-lg">{appointment.service ?? "Servicio no especificado"}</h3>
        <p>Dueño: {appointment.pet?.owner?.name ?? "Dueño desconocido"}</p>
        <p>Animal: {appointment.pet?.race ?? "Especie no especificada"}</p>
  
      </div>

      <div className="flex flex-col justify-between items-end h-full">
        <p className="text-black text-lg font-bold">{appointment.designatedDate? formatDate(appointment.designatedDate):""}</p>
      </div>
    </div>
  );
};

export default AppointmentCard;
