"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Heart } from "lucide-react";
interface HeaderProps {
  fullName: string;
  token: string;
  avatarSrc: string; // Recibimos la URL de la imagen
}

export const Header = ({ fullName, avatarSrc }: HeaderProps) => {
  return (
    <div className="bg-gradient-to-r from-violet-300 via-violet-500 to-fuchsia-300 py-3 px-4 flex items-center text-white">
      <Avatar className="w-16 h-16 ml-20 rounded-full overflow-hidden">
        <AvatarImage
          src={avatarSrc}
          alt={fullName}
          className="object-cover w-full h-full"
        />
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