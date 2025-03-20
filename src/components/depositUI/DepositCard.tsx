"use client";

import React from "react";
import { PencilIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

interface DepositCardProps {
  nombre: string;
  ubicacion: string;
  id?: number;
}

const DepositCard: React.FC<DepositCardProps> = ({ nombre, ubicacion,id }) => {
  const router = useRouter();
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border flex justify-between items-center">
      <div>
        <p className="text-lg font-bold">{nombre}</p>
        <p className="text-sm text-gray-600">Direccion: {ubicacion}</p>
      </div>
      <button onClick={
        () => {
          router.push(`/dashboard/stock/${id}`);
        }
      } className="p-2 rounded hover:bg-gray-200">
          <PencilIcon  className="w-5 h-5 text-gray-500" />
      </button>
    </div>
  );
};

export default DepositCard;