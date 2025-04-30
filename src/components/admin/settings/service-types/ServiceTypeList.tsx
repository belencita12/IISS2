"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/global/SearchBar";
import GenericTable from "@/components/global/GenericTable";
import { ConfirmationModal } from "@/components/global/Confirmation-modal";
import { ServiceTypeFormModal } from "./ServiceTypeFormModal";
import { toast } from "@/lib/toast";
import { Pencil, Trash } from "lucide-react";
import { ServiceTypeTableSkeleton } from "./ServiceTypeTableSkeleton";

interface ServiceType {
  id: number;
  slug: string;
  name: string;
  description: string;
  durationMin: number;
  price: number;
  tags: string[];
  img: {
    id: number;
    previewUrl: string;
    originalUrl: string;
  };
}

interface ServiceTypeListProps {
  token: string;
}

export default function ServiceTypeList({ token }: ServiceTypeListProps) {
  const router = useRouter();
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedServiceType, setSelectedServiceType] = useState<ServiceType | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    pageSize: 10,
  });

  const loadServiceTypes = async (page: number = 1, searchQuery: string = "") => {
    try {
      setLoading(true);
      // TODO: Implementar la llamada a la API para obtener los tipos de servicio
      // const response = await fetchServiceTypes(token, page, searchQuery);
      // setServiceTypes(response.data);
      // setPagination(response.pagination);
    } catch (error) {
      toast("error", "Error al cargar los tipos de servicio");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) loadServiceTypes(pagination.currentPage);
  }, [token, pagination.currentPage]);

  const handleSearch = (query: string) => loadServiceTypes(1, query);
  const handlePageChange = (page: number) => setPagination(prev => ({ ...prev, currentPage: page }));

  const columns = [
    { header: "Nombre", accessor: "name" },
    { header: "Descripción", accessor: "description" },
    { 
      header: "Duración", 
      accessor: (service: ServiceType) => `${service.durationMin} min` 
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

  const actions = [
    { icon: <Pencil className="w-4 h-4" />, onClick: (serviceType: ServiceType) => {
      setSelectedServiceType(serviceType);
      setIsFormOpen(true);
    }, label: "Editar" },
    { icon: <Trash className="w-4 h-4" />, onClick: (serviceType: ServiceType) => {
      setSelectedServiceType(serviceType);
      setIsModalOpen(true);
    }, label: "Eliminar" },
  ];

  const handleDelete = async () => {
    if (!selectedServiceType) return;
    try {
      // TODO: Implementar la llamada a la API para eliminar el tipo de servicio
      // await deleteServiceType(selectedServiceType.id, token);
      toast("success", "Tipo de servicio eliminado correctamente");
      loadServiceTypes(pagination.currentPage);
    } catch (error) {
      toast("error", "Error al eliminar el tipo de servicio");
    } finally {
      setIsModalOpen(false);
      setSelectedServiceType(null);
    }
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
        <Button variant="outline" className="px-6" onClick={() => {
          setSelectedServiceType(null);
          setIsFormOpen(true);
        }}>
          Agregar
        </Button>
      </div>

      {/* <GenericTable
        data={serviceTypes}
        columns={columns}
        actions={actions}
        pagination={pagination}
        onPageChange={handlePageChange}
        isLoading={loading}
        skeleton={<ServiceTypeTableSkeleton />}
        emptyMessage="No se encontraron tipos de servicio"
      /> */}

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
        onClose={() => setIsFormOpen(false)}
        token={token}
        onSuccess={() => loadServiceTypes(pagination.currentPage)}
        defaultValues={selectedServiceType}
      />
    </div>
  );
} 