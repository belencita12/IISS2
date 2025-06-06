"use client";

import { useState } from "react";
import { toast } from "@/lib/toast";
import type {
    AppointmentData,
    AppointmentQueryParams,
} from "@/lib/appointment/IAppointment";
import { APPOINTMENT_API } from "@/lib/urls";
import { usePaginatedFetch } from "@/hooks/api/usePaginatedFetch";
import SearchBar from "@/components/global/SearchBar";
import AppointmentDateFilter from "./filters/AppointmentDateFilter";
import AppointmentStatusFilter from "./filters/AppointmentStatusFilter";
import AppointmentCard from "./AppointmentCard";
import GenericPagination from "@/components/global/GenericPagination";
import { ConfirmationModal } from "@/components/global/Confirmation-modal";
import {
    completeAppointment,
    cancelAppointment,
} from "@/lib/appointment/service";
import { Modal } from "@/components/global/Modal";
import { Button } from "@/components/ui/button";
import AppointmentListSkeleton from "./Skeleton/AppointmentListSkeleton";
import { Textarea } from "@/components/ui/textarea";
import { useTranslations } from "next-intl";

interface AppointmentListProps {
    token: string;
    searchEmployee: string;
}

const AppointmentList = ({ token, searchEmployee }: AppointmentListProps) => {
    const [filters, setFilters] = useState<AppointmentQueryParams>({
        page: 1,
        search: undefined,
        searchEmployee: searchEmployee,
        fromDesignatedDate: undefined,
        toDesignatedDate: undefined,
        status: undefined,
    });

    const t = useTranslations();

    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedAppointment, setSelectedAppointment] =
        useState<AppointmentData | null>(null);
    const [modalAction, setModalAction] = useState<
        "complete" | "cancel" | null
    >(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [cancelModalOpen, setCancelModalOpen] = useState(false);
    const [cancelDescription, setCancelDescription] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isFiltering, setIsFiltering] = useState(false);
    const [resetCounter, setResetCounter] = useState(0);

    const { data, error, pagination, fetchData, refresh } =
        usePaginatedFetch<AppointmentData>(APPOINTMENT_API, token, {
            initialPage: 1,
            size: 10,
            autoFetch: false,
        });

    const performSearchWithFilters = (
        updatedFilters: AppointmentQueryParams
    ) => {
        setFilters(updatedFilters);
        const queryParams = Object.fromEntries(
            Object.entries(updatedFilters).filter(([key]) => key !== "page")
        );

        setIsLoading(true);
        setIsRefreshing(true);
        fetchData(updatedFilters.page || 1, queryParams).finally(() => {
            setIsLoading(false);
            setIsRefreshing(false);
        });
    };

    const handleFilterChange = (updatedFilters: AppointmentQueryParams) => {
        const newFilters = {
            ...filters,
            ...updatedFilters,
            searchEmployee,
            page: 1,
        };
        performSearchWithFilters(newFilters);
    };

    const handleSearch = (value: string) => {
        const newFilters = {
            ...filters,
            search: value,
            searchEmployee,
            page: 1,
        };
        performSearchWithFilters(newFilters);
    };

    const hasActiveFilters = Boolean(
        filters.fromDesignatedDate ||
        filters.toDesignatedDate ||
        filters.status
    );

    const resetFilters = () => {
        setIsFiltering(true);
        setFilters({
            page: 1,
            search: undefined,
            searchEmployee: searchEmployee,
            fromDesignatedDate: undefined,
            toDesignatedDate: undefined,
            status: undefined,
        });
        setIsFiltering(false);
        setResetCounter((prev) => prev + 1);
    };

    const openConfirmModal = (
        appointment: AppointmentData,
        action: "complete" | "cancel"
    ) => {
        setSelectedAppointment(appointment);
        setModalAction(action);
        if (action === "cancel") {
            setCancelModalOpen(true);
        } else {
            setIsModalOpen(true);
        }
    };

    const handleConfirmAction = async () => {
        if (!selectedAppointment || !modalAction) return;

        if (modalAction === "cancel" && cancelDescription.length < 12) {
            toast(
                "error",
                t("error.reasonCancel")
            );
            return;
        }

        try {
            setIsProcessing(true);
            setIsRefreshing(true);
            if (modalAction === "complete") {
                await completeAppointment(selectedAppointment.id, token);
            } else {
                await cancelAppointment(
                    selectedAppointment.id,
                    token,
                    cancelDescription
                );
            }
            toast(
                "success",
                `Cita ${
                    modalAction === "complete" ? "finalizada" : "cancelada"
                } con éxito`
            );
            await fetchData(filters.page || 1, { 
                search: filters.search,
                searchEmployee: searchEmployee,
                fromDesignatedDate: filters.fromDesignatedDate,
                toDesignatedDate: filters.toDesignatedDate,
                status: filters.status,
            });
        } catch (error: unknown) {
            if (error instanceof Error)
            toast("error", error.message);
        } finally {
            setIsProcessing(false);
            setIsRefreshing(false);
            setIsModalOpen(false);
            setCancelModalOpen(false);
            setSelectedAppointment(null);
            setModalAction(null);
            setCancelDescription("");
        }
    };

    if (error) {
        toast("error", error.message);
    }

    return (
        <div className="p-4 mx-auto">
            {hasActiveFilters && (
                <div className="flex justify-end">
                    <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => resetFilters()}
                    className="text-sm h-8 px-2 text-gray-600 mr-[10px]"
                    disabled={isFiltering}
                    >
                    {t("filters.clearFilters")}
                    </Button>
                </div>
            )}
            <div className="max-w-8xl mx-auto p-4 space-y-6">
                <SearchBar
                    placeholder="Buscar por nombre o RUC del cliente"
                    onSearch={handleSearch}
                    resetTrigger={resetCounter}
                />
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <AppointmentDateFilter
                            filters={filters}
                            setFilters={handleFilterChange}
                        />
                    </div>
                    <div className="flex-1">
                        <AppointmentStatusFilter
                            filters={filters}
                            setFilters={handleFilterChange}
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center mb-4">
                <h2 className="text-3xl font-bold">{t("appointmentTable.title")}</h2>
            </div>

            {isLoading ? (
                <AppointmentListSkeleton/>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {data?.length ? (
                        data.map((appointment) => (
                            <AppointmentCard
                                key={appointment.id}
                                appointment={appointment}
                                token={token}
                                onChange={refresh}
                                isProcessing={isProcessing || isRefreshing}
                                setIsProcessing={setIsProcessing}
                                onOpenModal={openConfirmModal}
                            />
                        ))
                    ) : (
                        <p>{t("appointmentTable.emptyMessage")}</p>
                    )}
                </div>
            )}

            <GenericPagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                handlePreviousPage={() => {
                    if (pagination.currentPage > 1) {
                        performSearchWithFilters({
                            ...filters,
                            page: pagination.currentPage - 1,
                        });
                    }
                }}
                handleNextPage={() => {
                    if (pagination.currentPage < pagination.totalPages) {
                        performSearchWithFilters({
                            ...filters,
                            page: pagination.currentPage + 1,
                        });
                    }
                }}
                handlePageChange={(page) => {
                    const safePage = Math.max(1, page);
                    performSearchWithFilters({ ...filters, page: safePage });
                }}
            />

            {selectedAppointment && modalAction === "complete" && (
                <ConfirmationModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        if (!isProcessing && !isRefreshing) {
                            setIsModalOpen(false);
                            setSelectedAppointment(null);
                            setModalAction(null);
                        }
                    }}
                    onConfirm={handleConfirmAction}
                    title={t("confirmationModal.appointment.confirmFinish")}
                    message={t("confirmationModal.appointment.confirmFinishDescription")}
                    confirmText={t("button.confirm")}
                    cancelText={t("button.cancel")}
                    isLoading={isProcessing}
                />
            )}

            {selectedAppointment && modalAction === "cancel" && (
                <Modal
                    isOpen={cancelModalOpen}
                    onClose={() => {
                        if (!isProcessing && !isRefreshing) {
                            setCancelModalOpen(false);
                            setSelectedAppointment(null);
                            setModalAction(null);
                            setCancelDescription("");
                        }
                    }}
                    title={t("confirmationModal.appointment.cancelTitle")}
                    size="md"
                >
                    <Textarea
                        className="w-full h-32 p-2 border border-gray-300 rounded"
                        placeholder={t("placeholder.reason")}
                        value={cancelDescription}
                        onChange={(e) => setCancelDescription(e.target.value)}
                        disabled={isProcessing}
                    />
                    <div className="flex justify-end mt-4 gap-2">
                        <Button
                            className="bg-white text-black px-4 py-2 rounded border hover:bg-gray-100"
                            onClick={() => {
                                if (!isProcessing && !isRefreshing) {
                                    setCancelModalOpen(false);
                                    setSelectedAppointment(null);
                                    setModalAction(null);
                                    setCancelDescription("");
                                }
                            }}
                            disabled={isProcessing || isRefreshing}
                        >
                            {t("button.cancel")}
                        </Button>
                        <Button
                            className="bg-red-600 text-white px-4 py-2 rounded border hover:bg-red-700"
                            onClick={handleConfirmAction}
                            disabled={
                                isProcessing ||
                                !cancelDescription.trim() ||
                                isRefreshing
                            }
                        >
                            {isProcessing ? t("button.cancelling") : t("button.confirm")}
                        </Button>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default AppointmentList;
