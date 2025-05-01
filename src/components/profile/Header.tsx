"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getAuth } from "./getAuth";
import { IUserProfile } from "@/lib/client/IUserProfile";
import { toast } from "@/lib/toast";
import { MapPin, Phone, Mail } from "lucide-react";

export interface HeaderProps {
  fullName: string;
  token: string;
  adress: string;
  phoneNumber: string;
  email: string;
}

export const Header = ({ fullName, token, adress, phoneNumber, email }: HeaderProps) => {
  const [avatarSrc, setAvatarSrc] = useState(
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
  );

  useEffect(() => {
    async function fetchAvatar() {
      try {
        const user: IUserProfile = await getAuth(token);
        if (user.image?.originalUrl) {
          setAvatarSrc(user.image.originalUrl);
        }
      } catch {
        toast("error", "Hubo un problema al cargar tu perfil");
      }
    }
    fetchAvatar();
  }, [token]);

  return (
    <div className="bg-[#606060] p-6 flex items-center text-white">
      <Avatar className="w-20 h-20 ml-20">
        <AvatarImage src={avatarSrc} alt={fullName} />
      </Avatar>
      <div className="ml-4">
        <h2 className="text-xl font-bold mt-2">{fullName}</h2>
        <div className="mt-4 flex flex-col space-y-1 text-white">
          <div className="flex items-center text-xs">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{adress}</span>
          </div>
          <div className="flex items-center text-xs">
            <Phone className="w-4 h-4 mr-1" />
            <span>{phoneNumber}</span>
          </div>
          <div className="flex items-center text-xs">
            <Mail className="w-4 h-4 mr-1" />
            <span>{email}</span>
          </div>
        </div>
      </div>
    </div>
  );
};