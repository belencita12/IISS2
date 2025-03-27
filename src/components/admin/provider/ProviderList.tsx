"use client";

import React, { useState } from "react";
import { EyeIcon } from "lucide-react";
import { Modal } from "@/components/global/Modal"; 
import { ProviderDetail } from "./ProviderDetail";

interface ProviderListProps {
  token: string;
}

// Lista de proveedores hardcodeada solo para pruebas
const providersList = [
  {
    id: 1,
    businessName: "Proveedor Uno",
    description: "Proveedor de prueba número uno",
    phoneNumber: "11111111",
    ruc: "111111111",
  },
  {
    id: 2,
    businessName: "Proveedor Dos",
    description: "Proveedor de prueba número dos",
    phoneNumber: "11111111",
    ruc: "111111111",
  },
];

export default function ProviderList({ token }: ProviderListProps) {
  // Estado para manejar el proveedor seleccionado y abrir/cerrar el modal
  const [selectedProviderId, setSelectedProviderId] = useState<number | null>(null);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Lista de Proveedores</h1>
      
      <div className="space-y-4">
        {providersList.map((provider) => (
          <div key={provider.id} className="flex items-center justify-between border p-4 rounded">
            <div>
              <p className="font-semibold">{provider.businessName}</p>
              <p>{provider.description}</p>
            </div>
            {/* Botón para seleccionar el proveedor y abrir el modal con los detalles */}
            <button
              onClick={() => setSelectedProviderId(provider.id)} 
              className="text-blue-500 hover:text-blue-700"
              title="Ver detalles"
            >
              <EyeIcon className="w-6 h-6" />
            </button>
          </div>
        ))}
      </div>
      
      {/* Modal que muestra los detalles del proveedor seleccionado */}
      <Modal isOpen={!!selectedProviderId} onClose={() => setSelectedProviderId(null)} size="lg">
        <div style={{ width: '600px', maxWidth: '100%' }}>
          {/* Componente que muestra los detalles del proveedor, pasando el id y el token */}
          <ProviderDetail
            token={token}
            isOpen={!!selectedProviderId} 
            onClose={() => setSelectedProviderId(null)} 
            providerId={selectedProviderId} 
          />
        </div>
      </Modal>
    </div>
  );
}
