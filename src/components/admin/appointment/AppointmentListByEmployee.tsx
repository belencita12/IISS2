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

interface AppointmentListProps {
    token: string;
    employeeRuc: string;
}

const AppointmentList = ({ token, employeeRuc }: AppointmentListProps) => {
    const [filters, setFilters] = useState<AppointmentQueryParams>({
        page: 1,
        clientRuc: undefined,
        employeeRuc: employeeRuc,
        fromDesignatedDate: undefined,
        toDesignatedDate: undefined,
        status: undefined,
    });

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
            employeeRuc,
            page: 1,
        };
        performSearchWithFilters(newFilters);
    };

    const handleSearch = (value: string) => {
        const newFilters = {
            ...filters,
            clientRuc: value,
            employeeRuc,
            page: 1,
        };
        performSearchWithFilters(newFilters);
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
                "El motivo de la cancelación debe tener al menos 12 caracteres"
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
            await fetchData(filters.page || 1, { employeeRuc });
        } catch (error) {
            toast("error", "Ocurrió un error al actualizar la cita");
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
        toast("error", error.message || "Error al cargar las citas");
    }

    return (
        <div className="p-4 mx-auto">
            <div className="max-w-8xl mx-auto p-4 space-y-6">
                <SearchBar
                    placeholder="Buscar por RUC del cliente"
                    onSearch={handleSearch}
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
                <h2 className="text-3xl font-bold">Citas</h2>
            </div>

            {isLoading ? (
                <p className="text-center text-black">Cargando citas...</p>
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
                        <p>No se encontraron citas.</p>
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
                    title="Confirmar Finalización"
                    message="¿Estás seguro de que quieres finalizar esta cita?"
                    confirmText="Confirmar"
                    cancelText="Cancelar"
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
                    title="Motivo de cancelación"
                    size="md"
                >
                    <textarea
                        className="w-full h-32 p-2 border border-gray-300 rounded"
                        placeholder="Escribe una razón para cancelar la cita"
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
                            Cancelar
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
                            {isProcessing ? "Cancelando..." : "Confirmar"}
                        </Button>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default AppointmentList;
