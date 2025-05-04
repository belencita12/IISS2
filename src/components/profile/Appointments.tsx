"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { APPOINTMENT_API } from "@/lib/urls";
import { useFetch } from "@/hooks/api/useFetch";
import GenericTable, { Column } from "@/components/global/GenericTable";
import { formatDate, formatTimeUTC } from "@/lib/utils"

interface Owner {
  id: number;
  name: string;
}

interface Pet {
  id: number;
  name: string;
  race: string;
  owner: Owner;
}

interface Employee {
  id: number;
  name: string;
}

interface Appointment {
  id: number;
  designatedDate: string;
  completedDate: string | null;
  details: string;
  service: string;
  status: 'PENDING'|'IN_PROGRESS'|'COMPLETED'|'CANCELLED';
  pet: Pet;
  employees: Employee[];
}

interface AppointmentsData {
  data: Appointment[];
  total: number;
}

interface AppointmentsProps {
  clientId: number;
  token: string;
  ruc: string | null;
}

export const Appointments = ({ clientId, token, ruc }: AppointmentsProps) => {
  const [executed, setExecuted] = useState(false);
  
  const {
    data: appointmentsResponse,
    loading,
    error: fetchError,
    execute
  } = useFetch<AppointmentsData>(
    APPOINTMENT_API,
    token,
    { immediate: false }
  );
  
  useEffect(() => {
    if (ruc && !executed) {
      const url = new URL(APPOINTMENT_API);
      url.searchParams.append("clientRuc", ruc);
      url.searchParams.append("page", "1");
      url.searchParams.append("size", "100");
      
      execute(undefined, url.toString());
      setExecuted(true);
    }
  }, [ruc, executed, execute]);
  
  const error = !ruc 
    ? "No se pudo obtener el RUC del cliente" 
    : fetchError?.message || null;
  
  const appointments = appointmentsResponse?.data || [];


  const iconFor = (svc: string) =>
    svc.toLowerCase().includes("vacun")

      
  const statusInfo = (st: Appointment["status"]) => {
    switch (st) {
      case "COMPLETED":   return { txt: "Completada", style: "bg-green-100 text-green-800" };
      case "CANCELLED":   return { txt: "Cancelada", style: "bg-red-100 text-red-800" };
      case "IN_PROGRESS": return { txt: "En progreso", style: "bg-blue-100 text-blue-800" };
      default:            return { txt: "Pendiente",  style: "bg-yellow-100 text-yellow-800" };
    }
  };

  // Definir las columnas para la tabla genérica
  const columns: Column<Appointment>[] = [
    {
      header: "Mascota",
      accessor: (app) => (
        
          <div>
            <p className="font-medium">{app.pet.name}</p>
          </div>
        
      )
    },
    {
      header: "Servicio",
      accessor: (app) => (
        <div className="flex items-center gap-3">
          {iconFor(app.service)}
          <div>
            <p className="font-medium">{app.service}</p>
          </div>
        </div>
      )
    },
    {
      header: "Encargado",
      accessor: (app) => (
        <div className="flex items-center gap-2">
         
          <div>
            {app.employees && app.employees.length > 0 ? (
              app.employees.map((emp, i) => (
                <p key={emp.id} className={i > 0 ?  "font-medium": "font-medium"}>
                  {emp.name}
                </p>
              ))
            ) : (
              <p className="text-sm text-gray-500">No asignado</p>
            )}
          </div>
        </div>
      )
    },
    {
      header: "Detalles",
      accessor: (app) => (
        <div className="flex items-start gap-2">
          
          <p className="font-medium">{app.details || "Sin detalles"}</p>
        </div>
      )
    },
    {
      header: "Fecha",
      accessor: (app) => (
        <div>
          <p className="font-medium">{formatDate(app.designatedDate)}</p>
        </div>
      )
    },
    {
      header: "Hora",
      accessor: (app) => (
        <div>
          <p className="font-medium">{formatTimeUTC(app.designatedDate)}</p>
        </div>
      )
    
    },
    
    
    {
      header: "Estado",
      accessor: (app) => (
        <span className={`px-2 py-1 rounded text-xs ${statusInfo(app.status).style}`}>
          {statusInfo(app.status).txt}
        </span>
      )
    },
  ];

  if (loading) return <p className="text-center py-4">Cargando citas…</p>;
  if (error)   return <p className="text-red-500 text-center py-4">{error}</p>;

  return (
    <section className="max-w-6xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Citas Agendadas</h2>
        <Button asChild className="flex items-center gap-2">
          <Link href="">
            
            Agendar nueva cita
          </Link>
        </Button>
      </div>

      <GenericTable 
        data={appointments}
        columns={columns}
        isLoading={loading}
        emptyMessage="No tienes citas agendadas"
        className="w-full"
      />


    </section>
  );
}
