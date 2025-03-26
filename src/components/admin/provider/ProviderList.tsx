"use client";
import React, { useState } from "react";
import { Provider } from "@/lib/provider/IProvider";
import { EyeIcon } from "lucide-react";
import { ProviderDetail } from "./ProviderDetail";
import { Modal } from "@/components/global/Modal";  // Importa el componente Modal

interface ProviderListProps {
  token: string;
}

// Datos de ejemplo para la lista de proveedores
const providersList: Provider[] = [
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
    phoneNumber: "22222222",
    ruc: "222222222",
  },
];

export default function ProviderList({ token }: ProviderListProps) {
  // Estado para controlar el proveedor seleccionado y la apertura del modal
  const [selectedProviderId, setSelectedProviderId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Función para abrir el modal con los detalles del proveedor seleccionado
  const handleOpenModal = (providerId: number) => {
    setSelectedProviderId(providerId);
    setIsModalOpen(true);
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setSelectedProviderId(null);
    setIsModalOpen(false);
  };

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

      {/* Modal de detalles del proveedor */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} size="lg" title="Detalles del Proveedor">
        <ProviderDetail
          token={token}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          providerId={selectedProviderId}
        />
      </Modal>
    </div>
  );
}
