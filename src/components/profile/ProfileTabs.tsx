"use client";
import { useState, useEffect } from "react";
import { Header } from "./Header";
import { PetsList } from "./PetLists";
import { Appointments } from "./Appointments";
import { User, Dog, Calendar } from "lucide-react";
import { ProfileUser } from "./ProfileUser";
import { toast } from "@/lib/toast";

interface ProfileTabsProps {
  fullName: string;
  token: string;
  clientId: number;
  ruc: string | null;
  avatarSrc: string;
}

export default function ProfileTabs({
  fullName: initialFullName,
  token,
  clientId,
  ruc,
  avatarSrc: initialAvatarSrc,
}: ProfileTabsProps) {
  const [selected, setSelected] = useState<"datos" | "mascotas" | "citas">("mascotas");
  const [userData, setUserData] = useState({
    fullName: initialFullName,
    avatarSrc: initialAvatarSrc,
    ruc: ruc
  });
  const [fetchErrors, setFetchErrors] = useState<string[]>([]);

  useEffect(() => {
    // Mostrar un solo toast si hay errores de fetch
    if (fetchErrors.length > 0) {
      toast("error", "Ha ocurrido un error de conexión");
    }
  }, [fetchErrors]);

  const updateUserData = (newData: { fullName?: string; avatarSrc?: string; ruc?: string | null }) => {
    setUserData(prev => ({
      ...prev,
      ...newData
    }));
  };

  const handleFetchError = (error: string) => {
    // Agregar error de manera única
    setFetchErrors(prev => {
      if (!prev.includes(error)) {
        return [...prev, error];
      }
      return prev;
    });
  };

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
        <Header 
          fullName={userData.fullName} 
          token={token} 
          avatarSrc={userData.avatarSrc} 
        />
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
      <div className="w-full">
        {selected === "datos" && (
          <ProfileUser 
            clientId={clientId} 
            token={token}
            updateUserData={updateUserData}
          />
        )}

        {selected === "mascotas" && (
          <PetsList 
            clientId={clientId} 
            token={token} 
            onFetchError={handleFetchError}
          />
        )}

        {selected === "citas" && (
          <Appointments 
            clientId={clientId} 
            token={token} 
            ruc={userData.ruc}
            onFetchError={handleFetchError}
          />
        )}
      </div>
    </div>
  );
}