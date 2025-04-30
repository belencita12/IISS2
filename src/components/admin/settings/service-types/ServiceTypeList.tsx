"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/global/SearchBar";
import GenericTable, { Column } from "@/components/global/GenericTable";
import { ConfirmationModal } from "@/components/global/Confirmation-modal";
import { toast } from "@/lib/toast";
import { Pencil, Trash } from "lucide-react";
import { ServiceTypeTableSkeleton } from "./ServiceTypeTableSkeleton";
import { ServiceTypeFormModal } from "./ServiceTypeFormModal";
import { useServiceTypeList, ServiceType } from "@/hooks/service-types/useServiceTypeList";

interface ServiceTypeListProps {
  token: string;
}

export default function ServiceTypeList({ token }: ServiceTypeListProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedServiceType, setSelectedServiceType] = useState<ServiceType | null>(null);

  const {
    serviceTypes,
    isLoading,
    error,
    pagination,
    onPageChange,
    onSearch,
  } = useServiceTypeList(token);

  const handleSearch = (query: string) => {
    onSearch(query);
  };

  const columns: Column<ServiceType>[] = [
    { header: "Nombre", accessor: "name" },
    { header: "Descripción", accessor: "description" },
    { 
      header: "Duración", 
      accessor: (service: ServiceType) => `${service.duration} min` 
    },
    { 
      header: "Precio", 
      accessor: (service: ServiceType) => `$${service.price.toFixed(2)}` 
    },
    { 
      header: "Tags", 
      accessor: (service: ServiceType) => service.tags.join(", ") 
    },
  ];

  const handleDelete = async () => {
    if (!selectedServiceType) return;
    
    try {
      // TODO: Implementar la llamada a la API para eliminar el tipo de servicio
      // await deleteServiceType(selectedServiceType.id, token);
      toast("success", "Tipo de servicio eliminado correctamente");
      onPageChange(pagination.currentPage);
    } catch (error) {
      console.error("Error al eliminar tipo de servicio:", error);
      toast("error", "Error al eliminar el tipo de servicio");
    } finally {
      setIsModalOpen(false);
      setSelectedServiceType(null);
    }
  };

  const handleEdit = (serviceType: ServiceType) => {
    setSelectedServiceType(serviceType);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (serviceType: ServiceType) => {
    setSelectedServiceType(serviceType);
    setIsModalOpen(true);
  };

  const actions = [
    { 
      icon: <Pencil className="w-4 h-4" />, 
      onClick: handleEdit, 
      label: "Editar" 
    },
    { 
      icon: <Trash className="w-4 h-4" />, 
      onClick: handleDeleteClick, 
      label: "Eliminar" 
    },
  ];

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setSelectedServiceType(null);
    onPageChange(pagination.currentPage);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedServiceType(null);
  };

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
          onClick={() => {
            setSelectedServiceType(null);
            setIsFormOpen(true);
          }}
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
        title="Eliminar Tipo de Servicio"
        message={`¿Seguro que quieres eliminar el tipo de servicio ${selectedServiceType?.name}?`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
      />

      <ServiceTypeFormModal
        isOpen={isFormOpen}
        onClose={handleFormClose}
        token={token}
        onSuccess={handleFormSuccess}
        //defaultValues={selectedServiceType}
      />
    </div>
  );
} 