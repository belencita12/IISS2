"use client";
import React, { useState } from "react";
import { EyeIcon } from "lucide-react";
import { ProviderDetailModal } from "./ProviderDetailModal";

interface ProviderListProps {
  token: string;
}

const providersList = [
  {
    id: 1,
    businessName: "Proveedor Uno",
    description: "Proveedor de prueba número uno",
    phoneNumber: "11111111",
    ruc: "111111111",
  },
];

export default function ProviderList({ token }: ProviderListProps) {
  const [selectedProviderId, setSelectedProviderId] = useState<number | null>(null);

  const handleOpenModal = (providerId: number) => setSelectedProviderId(providerId);
  
  const handleCloseModal = () => setSelectedProviderId(null);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Lista de Proveedores</h1>
      <div className="space-y-4">
        {providersList.map((provider) => (
          <div
            key={provider.id}
            className="flex items-center justify-between border p-4 rounded"
          >
            <div>
              <p className="font-semibold">{provider.businessName}</p>
              <p>{provider.description}</p>
            </div>
            <button
              onClick={() => handleOpenModal(provider.id!)}
              className="text-blue-500 hover:text-blue-700"
              title="Ver detalles"
            >
              <EyeIcon className="w-6 h-6" />
            </button>
          </div>
        ))}
      </div>
      
      <ProviderDetailModal
        token={token}
        isOpen={!!selectedProviderId}  
        onClose={handleCloseModal}
        providerId={selectedProviderId}
      />
    </div>
  );
}
