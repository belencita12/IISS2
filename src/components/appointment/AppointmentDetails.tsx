'use client';

import { useEffect, useState } from 'react';
import { getAppointmentById } from '@/lib/appointment/getAppointmentById';
import { AppointmentData } from '@/lib/appointment/IAppointment';
import { formatDate, formatTimeUTC } from '@/lib/utils';
import { useTranslations } from 'next-intl';

interface AppointmentDetailsProps {
  token: string;
  appointmentId: string;
}

export default function AppointmentDetails({ token, appointmentId }: AppointmentDetailsProps) {
  const [appointment, setAppointment] = useState<AppointmentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const a = useTranslations('AppointmentDetail');
  const b = useTranslations('Button');
  const e = useTranslations('Error');

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const data = await getAppointmentById(appointmentId, token);
        setAppointment(data);
      } catch (err) {
        setError('Error al cargar los detalles de la cita');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [appointmentId, token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-gray-600">{b("loading")}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        {error}
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="text-center text-gray-600 p-4">
        {e("notFound")}
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">{a("appointmentDetails")}</h2>
      
      <div className="space-y-4">
        <div className="border-b pb-4">
          <p className="font-semibold text-gray-700">{a("service")}</p>
          <p className="text-gray-600">{appointment.service}</p>
        </div>

        <div className="border-b pb-4">
          <p className="font-semibold text-gray-700">{a("date")}</p>
          <p className="text-gray-600">
            {formatDate(appointment.designatedDate)}, {formatTimeUTC(appointment.designatedDate)}
          </p>
        </div>

        <div className="border-b pb-4">
          <p className="font-semibold text-gray-700">{a("status")}</p>
          <p className="text-gray-600">
            {{
              PENDING: a("pending"),
              IN_PROGRESS: a("inProgress"),
              COMPLETED: a("completed"),
              CANCELLED: a("canceled"),
            }[appointment.status] || b("notFound")}
          </p>
        </div>

        <div className="border-b pb-4">
          <p className="font-semibold text-gray-700">{a("details")}</p>
          <p className="text-gray-600">
            {appointment.details ? appointment.details : e("noDetails")}
          </p>
        </div>

        <div className="border-b pb-4">
          <p className="font-semibold text-gray-700 mb-2">{a("pet")}</p>
          <div className="ml-4">
            <p className="text-gray-600">{a("name")} {appointment.pet.name}</p>
            <p className="text-gray-600">{a("race")} {appointment.pet.race}</p>
            <p className="text-gray-600">{a("owner")} {appointment.pet.owner.name}</p>
          </div>
        </div>

        <div>
          <p className="font-semibold text-gray-700 mb-2">{a("employee")}</p>
          <ul className="ml-4 space-y-1">
            {appointment.employees.map(emp => (
              <li key={emp.id} className="text-gray-600">
                {emp.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}