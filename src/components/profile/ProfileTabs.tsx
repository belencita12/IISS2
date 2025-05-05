"use client";
import { useState } from "react";
import { Header } from "./Header";
import { PetsList } from "./PetLists";
import { Appointments } from "./Appointments";
import { User, Dog, Calendar } from "lucide-react";

interface ProfileTabsProps {
  fullName: string;
  token: string;
  clientId: number;
  ruc: string | null;
  avatarSrc: string; // Recibimos la URL de la imagen
}

export default function ProfileTabs({
  fullName,
  token,
  clientId,
  ruc,
  avatarSrc, // Recibimos la URL de la imagen
}: ProfileTabsProps) {
  const [selected, setSelected] = useState<"datos" | "mascotas" | "citas">("mascotas");

  const tabClasses = (tab: string) =>
    `flex-1 text-center py-1 px-3 text-sm font-medium transition-colors cursor-pointer flex items-center justify-center gap-1.5
     border-b-2 ${
       selected === tab
         ? "bg-white text-violet-600 border-white shadow-md rounded-t-md"
         : "bg-violet-300/30 text-gray-700 border-transparent hover:bg-violet-200"
     }`;

  return (
    <div>
      <div className="bg-gradient-to-r from-violet-300 via-violet-500 to-fuchsia-300 pt-2 pb-0">
        <Header fullName={fullName} token={token} avatarSrc={avatarSrc} />
        <div className="flex w-full mt-2 border-b border-gray-300/30">
          <div
            onClick={() => setSelected("datos")}
            className={tabClasses("datos")}
          >
            <User className="w-4 h-4" />
            Mis Datos
          </div>
          <div
            onClick={() => setSelected("mascotas")}
            className={tabClasses("mascotas")}
          >
            <Dog className="w-4 h-4" />
            Mis Mascotas
          </div>
          <div
            onClick={() => setSelected("citas")}
            className={tabClasses("citas")}
          >
            <Calendar className="w-4 h-4" />
            Mis Citas
          </div>
        </div>
      </div>

      {/* Contenido de las pestañas */}
      <div className="w-full px-4">
        {selected === "datos" && (
          <div className="text-center text-gray-500 py-10">
            <p>Próximamente podrás ver y editar tus datos aquí.</p>
          </div>
        )}

        {selected === "mascotas" && (
          <PetsList clientId={clientId} token={token} />
        )}

        {selected === "citas" && (
          <Appointments clientId={clientId} token={token} ruc={ruc} />
        )}
      </div>
    </div>
  );
}
