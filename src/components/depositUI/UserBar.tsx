"use client";

import React from "react";
import Image from "next/image";

interface UserBarProps {
  token: string;
  nombre: string;
}

const UserBar: React.FC<UserBarProps> = ({ token, nombre }) => {
  return (
    <div className="bg-gray-500 p-4 flex justify-center text-white">
      <Image
        src="/default-avatar.png"
        alt="User Profile"
        width={50}
        height={50}
        className="rounded-full border border-white"
      />
      <div className="ml-3 w-1/2">
        <p className="text-lg font-bold">{nombre}</p>
        <p className="text-sm">Bienvenido al panel de administración</p>
      </div>
    </div>
  );
};

export default UserBar;
