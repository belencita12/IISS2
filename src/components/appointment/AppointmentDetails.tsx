'use client';

import { useEffect, useState } from 'react';
import { getAppointmentById } from '@/lib/appointment/getAppointmentById';
import { AppointmentData } from '@/lib/appointment/IAppointment';

interface AppointmentDetailsProps {
  token: string;
  appointmentId: string;
}

export default function AppointmentDetails({ token, appointmentId }: AppointmentDetailsProps) {
  const [appointment, setAppointment] = useState<AppointmentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const data = await getAppointmentById(appointmentId, token);
        setAppointment(data);
      } catch (err) {
        setError('Error al cargar los detalles de la cita');
        console.error('Error fetching appointment:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [appointmentId, token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-gray-600">Cargando...</div>
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
        No se encontró la cita
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Detalle de la cita</h2>
      
      <div className="space-y-4">
        <div className="border-b pb-4">
          <p className="font-semibold text-gray-700">Servicio</p>
          <p className="text-gray-600">{appointment.service}</p>
        </div>

        <div className="border-b pb-4">
          <p className="font-semibold text-gray-700">Fecha designada</p>
          <p className="text-gray-600">
            {new Date(appointment.designatedDate).toLocaleString()}
          </p>
        </div>

        <div className="border-b pb-4">
          <p className="font-semibold text-gray-700">Estado</p>
          <p className="text-gray-600">{appointment.status}</p>
        </div>

        <div className="border-b pb-4">
          <p className="font-semibold text-gray-700">Detalles</p>
          <p className="text-gray-600">{appointment.details}</p>
        </div>

        <div className="border-b pb-4">
          <p className="font-semibold text-gray-700 mb-2">Mascota</p>
          <div className="ml-4">
            <p className="text-gray-600">Nombre: {appointment.pet.name}</p>
            <p className="text-gray-600">Raza: {appointment.pet.race}</p>
            <p className="text-gray-600">Dueño: {appointment.pet.owner.name}</p>
          </div>
        </div>

        <div>
          <p className="font-semibold text-gray-700 mb-2">Empleados encargados</p>
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