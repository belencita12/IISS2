"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getAuth } from "./getAuth";
import { IUserProfile } from "@/lib/client/IUserProfile";
import { toast } from "@/lib/toast";


interface HeaderProps {
  fullName: string;
  token: string;
}

export const Header = ({ fullName, token}: HeaderProps) => {
  const [avatarSrc, setAvatarSrc] = useState(
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
  );

  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        const user: IUserProfile = await getAuth(token);
        if(user?.image?.originalUrl){
            setAvatarSrc(user.image.originalUrl);
        }
      } catch {
        toast("error", "Hubo un problema al cargar tu perfil");
      }
    };
    if(token){
        fetchAvatar();
    }

  }, [token]);

  return (
    <div className="bg-[#606060] p-6 flex items-center text-white">
      <Avatar className="w-20 h-20 ml-20">
        <AvatarImage src={avatarSrc} alt={fullName} />
      </Avatar>
      <div className="ml-4">
        <h2 className="text-xl font-bold mt-2">{fullName}</h2>
        <Badge className="bg-gray-300 text-black text-sm mt-2 hover:bg-gray-300">
          Veterinaria Cliente Fiel
        </Badge>
        <p className="text-base mt-2">Bienvenido a nuestro sistema de veterinaria</p>
      </div>
    </div>
  );
};
