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
import { useTranslations } from "next-intl";

export default function ProviderList({ token }: { token: string }) {
  const router = useRouter();
  const t = useTranslations();
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

    } catch (error: unknown) {
      if (error instanceof Error)
      toast("error", error.message);
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
      toast("success", t("success.successDeleteProvider"));

      await fetchProviders({
        page: 1,
      });

    } catch (error:unknown) {
      if (error instanceof Error)
      toast("error", error.message);
    } finally {
      setProviderIdToDelete(null);
    }
  }

  const columns: Column<Provider>[] = [
    { header: t("providers.table.name"), accessor: "businessName" },
    { header: t("providers.table.ruc"), accessor: "ruc" }
  ];

  const actions: TableAction<Provider>[] = [
    {
      icon: <Eye className="w-4 h-4" />,
      onClick: (p) => {
        setSelectedProviderId(p.id ?? null);
      },
      label: t("button.seeDetails"),
    },
    {
      icon: <Pencil className="w-4 h-4" />,
      onClick: (p) => router.push(`/dashboard/settings/providers/update/${p.id}`),
      label: t("button.edit"),
    },
    {
      icon: <Trash className="w-4 h-4" />,
      onClick: (p) => {
        setProviderIdToDelete(p.id ?? null);
      },
      label: t("button.edit"),
    },
  ];

  return (
    <div className="p-6 mx-auto">
      <SearchBar
        onSearch={handleSearch}
        placeholder={t("search.searchByNameOrRucProvider")}
      />
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-4 mt-6">
          <h2 className="text-3xl font-bold">{t("providers.table.title")}</h2>
          <Button
              variant="outline"
              onClick={() => {
              setIsRedirecting(true);
               router.push("/dashboard/settings/providers/register")
              }}
              disabled={isRedirecting}
            >
            {t("button.add")}
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
        emptyMessage={t("providers.table.emptyMessage")}
      />

      {/* Modal que muestra los detalles del proveedor seleccionado */}
      <Modal 
        isOpen={!!selectedProviderId} 
        onClose={() => setSelectedProviderId(null)} 
        size="lg"
      >
        <div style={{ width: '600px', maxWidth: '100%' }}>
          {selectedProviderId !== null && (
            <ProviderDetail
              token={token}
              providerId={selectedProviderId}
              onClose={() => setSelectedProviderId(null)}
            />
          )}
        </div>
      </Modal>
      <ConfirmationModal
        isOpen={!!providerIdToDelete}
        onClose={() => setProviderIdToDelete(null)}
        onConfirm={() => handleDelete(providerIdToDelete ?? null)}
        title={t("confirmationModal.providers.titleDelete")}
        message={t("confirmationModal.providers.messageDelete", {provider : providers.find(p => p.id === providerIdToDelete)?.businessName ?? ""})}
        confirmText={t("button.delete")}
        cancelText={t("button.cancel")}
        variant="danger"
      />
    </div>
  );
}