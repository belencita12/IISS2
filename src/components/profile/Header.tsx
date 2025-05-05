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
  const [avatarSrc, setAvatarSrc] = useState("/blank-profile-picture-973460_1280.png");

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
    <div className="bg-gradient-to-r 
            from-violet-300 
            via-violet-500 
            to-fuchsia-300 
            py-3 px-4 flex items-center text-white"> {/* py-2 en lugar de p-6 */}
      <Avatar className="w-25 h-20 ml-20"> {/* Reducido a w-12 h-12 */}
        <AvatarImage src={avatarSrc} alt={fullName} />
      </Avatar>
      <div className="ml-3">
        <h2 className="text-xl font-bold">{fullName}</h2> {/* text-base y sin mt */}
        <Badge className="bg-white text-pink-500 text-xs px-2 py-0.5 rounded-full border border-gray-200  hover:bg-white hover:text-pink-500 ">
          Veterinaria Cliente Fiel
        </Badge>
        <p className="text-base mt-0.5">Bienvenido a nuestro sistema de veterinaria</p> {/* text-xs y mt-0.5 */}
      </div>
    </div>
  );
};