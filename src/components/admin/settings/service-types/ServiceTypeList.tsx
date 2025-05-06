"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/global/SearchBar";
import GenericTable, { Column } from "@/components/global/GenericTable";
import { ConfirmationModal } from "@/components/global/Confirmation-modal";
import { toast } from "@/lib/toast";
import { Eye, Pencil, Trash } from "lucide-react";
import { ServiceTypeTableSkeleton } from "./ServiceTypeTableSkeleton";
import { useServiceTypeList, ServiceType } from "@/hooks/service-types/useServiceTypeList";
import { useServiceTypeApi } from "@/lib/service-types/service";

interface ServiceTypeListProps {
  token: string;
}

export default function ServiceTypeList({ token }: ServiceTypeListProps) {
  const { deleteServiceType } = useServiceTypeApi(token);
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedServiceType, setSelectedServiceType] = useState<ServiceType | null>(null);

  const {
    serviceTypes,
    isLoading,
    pagination,
    onPageChange,
    onSearch,
  } = useServiceTypeList(token);

  const handleSearch = (query: string) => {
    onSearch(query);
  };

  const columns: Column<ServiceType>[] = [
    { 
      header: "Nombre", 
      accessor: "name",
      className: "font-medium"
    },
    { 
      header: "Descripción", 
      accessor: "description",
      className: "text-gray-600"
    },
    { 
      header: "Duración (min)", 
      accessor: (service: ServiceType) => `${service.durationMin} min`,
      className: "text-gray-600"
    },
    { 
      header: "Precio", 
      accessor: (service: ServiceType) => `Gs. ${service.price.toLocaleString('es-PY', { maximumFractionDigits: 0 })}`,
      className: "font-medium"
    },
    { 
      header: "Tags", 
      accessor: (service: ServiceType) => service.tags?.join(", ") || "-",
      className: "text-gray-600"
    }
  ];

  const handleView = (serviceType: ServiceType) => {
    router.push(`/dashboard/settings/service-types/${serviceType.id}`);
  };

  const handleEdit = (serviceType: ServiceType) => {
    router.push(`/dashboard/settings/service-types/${serviceType.id}/edit`);
  };

  const handleDelete = async () => {
    if (!selectedServiceType) return;
    
    try {
      await deleteServiceType(selectedServiceType.id);
      toast("success", "Tipo de servicio eliminado correctamente");
      onPageChange(pagination.currentPage);
    } catch (error) {
      toast("error", "Error al eliminar el tipo de servicio. Por favor, intente nuevamente.");
    } finally {
      setIsModalOpen(false);
      setSelectedServiceType(null);
    }
  };

  const handleDeleteClick = (serviceType: ServiceType) => {
    setSelectedServiceType(serviceType);
    setIsModalOpen(true);
  };

  const actions = [
    { 
      icon: <Eye className="w-4 h-4" />, 
      onClick: handleView, 
      label: "Ver detalles" 
    },
    { 
      icon: <Pencil className="w-4 h-4" />, 
      onClick: handleEdit, 
      label: "Editar tipo de servicio" 
    },
    { 
      icon: <Trash className="w-4 h-4" />, 
      onClick: handleDeleteClick, 
      label: "Eliminar tipo de servicio" 
    }
  ];

  return (
    <div className="p-4 mx-auto">
      <div className="flex items-center gap-4 mb-4">
        <SearchBar 
          onSearch={handleSearch} 
          placeholder="Buscar tipo de servicio..." 
        />
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold">Tipos de Servicio</h2>
        <Button 
          variant="outline" 
          className="px-6" 
          onClick={() => router.push("/dashboard/settings/service-types/register")}
        >
          Agregar
        </Button>
      </div>

      <GenericTable
        data={serviceTypes}
        columns={columns}
        actions={actions}
        pagination={pagination}
        onPageChange={onPageChange}
        isLoading={isLoading}
        skeleton={<ServiceTypeTableSkeleton />}
        emptyMessage="No se encontraron tipos de servicio"
        className="mt-4"
      />

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
        title="¿Estás seguro de eliminar este tipo de servicio?"
        message={`El tipo de servicio ${selectedServiceType?.name} será eliminado permanentemente.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
      />
    </div>
  );
} 