"use client";

import React, { useEffect, useState } from "react";
import { Modal } from "@/components/global/Modal";
import { ProviderDetail } from "./ProviderDetail";
import SearchBar from "@/components/global/SearchBar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import GenericTable, { Column, PaginationInfo, TableAction } from "@/components/global/GenericTable";
import { Provider, ProviderQueryParams } from "@/lib/provider/IProvider";
import { getProviders } from "@/lib/provider/getProviders";
import { Eye, Pencil, Trash } from "lucide-react";
import { toast } from "@/lib/toast";
import { ConfirmationModal } from "@/components/global/Confirmation-modal";
import { deleteProviderById } from "@/lib/provider/deleteProviderById";
import ProviderTableSkeleton from "./skeleton/ProviderTableSkeleton";

export default function ProviderList({ token }: { token: string }) {
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    pageSize: 10,
  });
  // Estado para manejar el proveedor seleccionado y abrir/cerrar el modal
  const [selectedProviderId, setSelectedProviderId] = useState<number | null>(null);
  // Estado para manejar el proveedor a eliminar
  const [providerIdToDelete, setProviderIdToDelete] = useState<number | null>(null);

  const fetchProviders = async (params: ProviderQueryParams) => {
    setIsLoading(true);
    try {
      params.query = params.query?.trim();

      const response = await getProviders(token, params);
      setProviders(response.data);
      setPagination({
        currentPage: response.currentPage,
        totalPages: response.totalPages,
        totalItems: response.totalItems,
        pageSize: response.pageSize,
      });

    } catch (error) {
      toast("error", "Error al obtener proveedores");
    } finally {
      setIsLoading(false);
    }
  }

  // Obtener proveedores al cargar la página
  useEffect(() => {
    fetchProviders({
      page: 1,
    })
  }, [])

  // Buscar proveedores mediante query del search bar
  const handleSearch = (query: string) => {
    fetchProviders({
      page: 1,
      query: query,
    })
  }

  // Obtener proveedores cambiando la página actual
  const handlePageChange = (page: number) => {
    fetchProviders({
      page: page,
    })
  }

  // Elimina el proveedor que corresponde al id
  const handleDelete = async (id: number | null) => {
    if (!id) return;
    try {
      await deleteProviderById(token, id);
      toast("success", "Proveedor eliminado exitosamente");

      await fetchProviders({
        page: 1,
      });

    } catch (error) {
      toast("error", "Error al eliminar proveedor");
    } finally {
      setProviderIdToDelete(null);
    }
  }

  const columns: Column<Provider>[] = [
    { header: "Nombre", accessor: "businessName" },
    { header: "RUC", accessor: "ruc" }
  ];

  const actions: TableAction<Provider>[] = [
    {
      icon: <Eye className="w-4 h-4" />,
      onClick: (p) => {
        setSelectedProviderId(p.id ?? null);
      },
      label: "Ver detalles",
    },
    {
      icon: <Pencil className="w-4 h-4" />,
      onClick: (p) => router.push(`/dashboard/settings/providers/update/${p.id}`),
      label: "Editar",
    },
    {
      icon: <Trash className="w-4 h-4" />,
      onClick: (p) => {
        setProviderIdToDelete(p.id ?? null);
      },
      label: "Eliminar",
    },
  ];

  return (
    <div className="p-6 mx-auto">
      <SearchBar
        onSearch={handleSearch}
        placeholder="Buscar proveedor por su RUC o razón social"
        manualSearch={true}
      />
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-4 mt-6">
          <h2 className="text-3xl font-bold">Lista de Proveedores</h2>
          <Button
              variant="outline"
              onClick={() => {
              setIsRedirecting(true);
               router.push("/dashboard/settings/providers/register")
              }}
              disabled={isRedirecting}
            >
            Agregar
          </Button>
        </div>

      <GenericTable
        data={providers}
        columns={columns}
        actions={actions}
        pagination={pagination}
        onPageChange={handlePageChange}
        isLoading={isLoading}
        skeleton={<ProviderTableSkeleton />}
        emptyMessage="No se encontraron proveedores"
      />

      {/* Modal que muestra los detalles del proveedor seleccionado */}
      <Modal 
        isOpen={!!selectedProviderId} 
        onClose={() => setSelectedProviderId(null)} 
        size="lg"
      >
        <div style={{ width: '600px', maxWidth: '100%' }}>
          {/* Componente que muestra los detalles del proveedor, pasando el id y el token */}
          {selectedProviderId !== null && (
            <ProviderDetail
              token={token}
              providerId={selectedProviderId}
            />
          )}
        </div>
      </Modal>
      <ConfirmationModal
        isOpen={!!providerIdToDelete}
        onClose={() => setProviderIdToDelete(null)}
        onConfirm={() => handleDelete(providerIdToDelete ?? null)}
        title={`¿Estás seguro de eliminar este proveedor? `}
        message={`${providers.find(p => p.id === providerIdToDelete)?.businessName} será eliminado de la lista de proveedores.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
      />
    </div>
  );
}