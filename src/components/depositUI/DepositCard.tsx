"use client";

import React from "react";
import { PencilIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

interface DepositCardProps {
  nombre: string;
  ubicacion: string;
  id?: number;
}

const DepositCard: React.FC<DepositCardProps> = ({ nombre, ubicacion,id }) => {
  return (
    <Link href={`/dashboard/stock/${id}`} className="bg-white p-4 rounded-lg shadow-sm border flex justify-between items-center hover:-translate-y-1 transition-transform duration-300 hover:shadow-md">
      <div>
        <p className="text-lg font-bold">{nombre}</p>
        <p className="text-sm text-gray-600">Direccion: {ubicacion}</p>
      </div>
      <button className="p-2 rounded hover:bg-gray-200">
          <PencilIcon  className="w-5 h-5 text-gray-500" />
      </button>
    </Link>
  );
};

export default DepositCard;