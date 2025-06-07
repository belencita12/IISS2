"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/global/SearchBar";
import GenericTable, { Column } from "@/components/global/GenericTable";
import { ConfirmationModal } from "@/components/global/Confirmation-modal";
import { toast } from "@/lib/toast";
import { Eye, Pencil, Trash } from "lucide-react";

import { useServiceTypeList, ServiceType } from "@/hooks/service-types/useServiceTypeList";
import { useServiceTypeApi } from "@/lib/service-types/service";
import ServiceTypeTableSkeleton from "./Skeleton/ServiceTypeTableSkeleton";
import { useTranslations } from "next-intl";

interface ServiceTypeListProps {
  token: string;
}

export default function ServiceTypeList({ token }: ServiceTypeListProps) {
  const { deleteServiceType } = useServiceTypeApi(token);
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedServiceType, setSelectedServiceType] = useState<ServiceType | null>(null);

  const t = useTranslations();

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
      header: t("serviceTypes.table.name"), 
      accessor: "name",
      className: "font-medium"
    },
    { 
      header: t("serviceTypes.table.description"), 
      accessor: "description",
      className: "text-gray-600"
    },
    { 
      header: t("serviceTypes.table.duration"), 
      accessor: (service: ServiceType) => `${service.durationMin} min`,
      className: "text-gray-600"
    },
    { 
      header: t("serviceTypes.table.price"), 
      accessor: (service: ServiceType) => t("serviceTypes.table.priceGs", {price:service.price.toLocaleString('es-PY', { maximumFractionDigits: 0 })}),
      className: "font-medium"
    },
    { 
      header:t("serviceTypes.table.tags"), 
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
      toast("success", t("success.successDeleteService"));
      onPageChange(pagination.currentPage);
    } catch (error: unknown) {
      if (error instanceof Error)
      toast("error", error.message);
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
      label: t("button.seeDetails")
    },
    { 
      icon: <Pencil className="w-4 h-4" />, 
      onClick: handleEdit, 
      label: t("button.edit")
    },
    { 
      icon: <Trash className="w-4 h-4" />, 
      onClick: handleDeleteClick, 
      label: t("button.delete")
    }
  ];

  return (
    <div className="p-4 mx-auto">
      <div className="flex items-center gap-4 mb-4">
        <SearchBar 
          onSearch={handleSearch} 
          placeholder={t("placeholder.name")}
        />
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold">{t("serviceTypes.table.title")}</h2>
        <Button 
          variant="outline" 
          className="px-6" 
          onClick={() => router.push("/dashboard/settings/service-types/register")}
        >
          {t("button.add")}
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
        emptyMessage={t("serviceTypes.table.emptyMessage")}
        className="mt-4"
      />

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
        title={t("confirmationModal.serviceTypes.titleDelete")}
        message={t("confirmationModal.serviceTypes.messageDelete", {service : selectedServiceType?.name ?? ""})}
        confirmText={t("button.delete")}
        cancelText={t("button.cancel")}
        variant="danger"
      />
    </div>
  );
} 