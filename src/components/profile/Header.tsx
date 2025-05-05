"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getAuth } from "./getAuth";
import { IUserProfile } from "@/lib/client/IUserProfile";
import { toast } from "@/lib/toast";
import { Heart } from "lucide-react";

interface HeaderProps {
  fullName: string;
  token: string;
}

export const Header = ({ fullName, token }: HeaderProps) => {
  const [avatarSrc, setAvatarSrc] = useState(
    "/blank-profile-picture-973460_1280.png"
  );

  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        const user: IUserProfile = await getAuth(token);
        if (user?.image?.originalUrl) {
          setAvatarSrc(user.image.originalUrl);
        }
      } catch {
        toast("error", "Hubo un problema al cargar tu perfil");
      }
    };
    if (token) {
      fetchAvatar();
    }
  }, [token]);

  return (
    <div
      className="bg-gradient-to-r 
            from-violet-300 
            via-violet-500 
            to-fuchsia-300 
            py-3 px-4 flex items-center text-white"
    >
      <Avatar className="w-25 h-20 ml-20">
        <AvatarImage src={avatarSrc} alt={fullName} />
      </Avatar>
      <div className="ml-3">
        <h2 className="text-xl font-bold">{fullName}</h2>
        <Badge className="bg-white text-pink-500 text-xs px-2 py-0.5 rounded-full border border-gray-200 hover:bg-white hover:text-pink-500">
          <Heart className="w-4 h-4 mr-1" />
          Veterinaria Cliente Fiel
        </Badge>
        <p className="text-base">
          Bienvenido a nuestro sistema de veterinaria
        </p>
      </div>
    </div>
  );
};