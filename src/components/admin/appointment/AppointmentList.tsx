"use client";

import { useEffect, useState } from "react";
import { toast } from "@/lib/toast";
import {
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
import { useRouter } from "next/navigation";
import AppointmentListSkeleton from "./Skeleton/AppointmentListSkeleton";
import { useTranslations } from "next-intl";
import useDebounce from "@/hooks/useDebounce";
import { downloadFromBlob, normalizeText } from "@/lib/utils";
import ExportButton from "@/components/global/ExportButton";
import { getAppointmentReport } from "@/lib/appointment/getAppointmentReport";
import { Textarea } from "@/components/ui/textarea";
import { ro, se } from "date-fns/locale";
import { useCurrentAppointment } from "@/context/appointment/CurrentApointment";

interface AppointmentListProps {
    token: string;
}

const AppointmentList = ({ token }: AppointmentListProps) => {

    const t = useTranslations();

    const router = useRouter();
    const [filters, setFilters] = useState<AppointmentQueryParams>({
        page: 1,
        search: undefined,
        searchEmployee: undefined, 
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
    const [searchValue, setSearchValue] = useState("");
    const [employeeSearchValue, setEmployeeSearchValue] = useState("");
    const debouncedSearchValue = useDebounce(searchValue, 500);
    const debouncedEmployeeSearchValue = useDebounce(employeeSearchValue, 500);
    const [isFiltering, setIsFiltering] = useState(false);
    const [resetCounter, setResetCounter] = useState(0);

    const [isGettingReport, setIsGettingReport] = useState(false);
    const { setCurrentAppointment } = useCurrentAppointment();
    const {
        data,
        loading: isLoading,
        error,
        pagination = {
            currentPage: 1,
            totalPages: 1,
            totalItems: 0,
            pageSize: 10,
        },
        setPage,
        search,
        refresh,
    } = usePaginatedFetch<AppointmentData>(APPOINTMENT_API, token, {
        initialPage: 1,
        autoFetch: true,
        extraParams: {
            search: filters.search,
            searchEmployee: filters.employeeRuc,
            fromDesignatedDate: filters.fromDesignatedDate,
            toDesignatedDate: filters.toDesignatedDate,
            status: filters.status,
        },
    });

    useEffect(() => {
        const normalizedClientSearch = debouncedSearchValue
            ? normalizeText(debouncedSearchValue)
            : undefined;

        const normalizedEmployeeSearch = debouncedEmployeeSearchValue
            ? normalizeText(debouncedEmployeeSearchValue)
            : undefined;

        const updatedFilters = {
            search: normalizedClientSearch,
            searchEmployee: normalizedEmployeeSearch,
            fromDesignatedDate: filters.fromDesignatedDate,
            toDesignatedDate: filters.toDesignatedDate,
            status: filters.status,
        };

        search(updatedFilters);
    }, [
        debouncedSearchValue,
        debouncedEmployeeSearchValue,
        filters.fromDesignatedDate,
        filters.toDesignatedDate,
        filters.status,
    ]);

    const handleFilterChange = (updatedFilters: AppointmentQueryParams) => {
        const { page, size, ...safeFilters } = updatedFilters;
        setFilters((prev) => ({
            ...prev,
            ...safeFilters,
            page: 1,
        }));
    };

    const resetFilters = () => {
        setIsFiltering(true);
        setFilters({
            page: 1,
            search: undefined,
            searchEmployee: undefined,
            fromDesignatedDate: undefined,
            toDesignatedDate: undefined,
            status: undefined,
        });
        setSearchValue("");
        setEmployeeSearchValue("");
        setIsFiltering(false);
        setResetCounter((prev) => prev + 1);
    };

    const handleGetAppointmentReport = async () => {
        const { fromDesignatedDate: from, toDesignatedDate: to } = filters;

        if (!from || !to) {
            toast(
                "error",
                t("error.errorLimitDate")
            );
            return;
        }

        setIsGettingReport(true);
        const result = await getAppointmentReport({
            token,
            from,
            to,
        });

        if (!(result instanceof Blob)) {
            toast("error", result.message);
        } else {
            downloadFromBlob(result);
        }

        setIsGettingReport(false);
    };

    const hasActiveFilters = Boolean(
        searchValue ||
        filters.fromDesignatedDate ||
        filters.toDesignatedDate ||
        filters.status ||
        employeeSearchValue
    );


    const openConfirmModal = (
        appointment: AppointmentData,
        action: "complete" | "cancel"
    ) => {
        if (action === "complete") {
            const appointmentDate = new Date(appointment.designatedDate);
            const currentDate = new Date();
            appointmentDate.setHours(0, 0, 0, 0);
            currentDate.setHours(0, 0, 0, 0);

            if (appointmentDate > currentDate) {
                toast(
                    "error",
                    t("error.errorEndDate")
                );
                return;
            }
        }

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

        try {
            setIsProcessing(true);
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
                    modalAction === "complete" ? t("appointmentStatus.completed") : t("appointmentStatus.cancelled")
                } con éxito`
            );
            refresh();
            setCurrentAppointment(selectedAppointment);
            console.log("Selected Appointment:", selectedAppointment);
            router.push(`/dashboard/appointment/${selectedAppointment.id}`);
        } catch (error: unknown) {
            if (error instanceof Error) toast("error", error.message);
        } finally {
            setIsProcessing(false);
            setIsModalOpen(false);
            setCancelModalOpen(false);
            setSelectedAppointment(null);
            setModalAction(null);
            setCancelDescription("");
        }
    };

    if (error instanceof Error ) toast("error", error.message );

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
                    Limpiar filtros
                    </Button>
                </div>
            )}

            <div className="max-w-8xl mx-auto p-4 space-y-6">
                <div className="flex space-x-4">
                    <SearchBar
                        placeholder={t("search.searchByNameOrRuc")}
                        onSearch={setSearchValue}
                        resetTrigger={resetCounter}
                    />
                    <SearchBar
                        placeholder={t("search.searchByNameOrRucEmployee")}
                        onSearch={setEmployeeSearchValue}
                        resetTrigger={resetCounter}
                    />
                </div>

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
                <div className="flex justify-between items-center mb-4">
                    <Button
                        variant="outline"
                        className="px-6 mr-2"
                        onClick={() =>
                            router.push("/dashboard/appointment/register")
                        }
                    >
                        {t("button.schedule")}
                    </Button>
                    <ExportButton
                        handleGetReport={handleGetAppointmentReport}
                        isLoading={isGettingReport}
                    />
                </div>
            </div>

            {isLoading ? (
                <AppointmentListSkeleton />
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {data?.length ? (
                        data.map((appointment) => (
                            <AppointmentCard
                                key={appointment.id}
                                appointment={appointment}
                                token={token}
                                onChange={refresh}
                                isProcessing={isProcessing}
                                setIsProcessing={setIsProcessing}
                                onOpenModal={openConfirmModal}
                            />
                        ))
                    ) : (
                        <p>{t("error.notFoundAppointments")}</p>
                    )}
                </div>
            )}

            <GenericPagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                handlePreviousPage={() => setPage(pagination.currentPage - 1)}
                handleNextPage={() => setPage(pagination.currentPage + 1)}
                handlePageChange={setPage}
            />

            {selectedAppointment && modalAction === "complete" && (
                <ConfirmationModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
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
                    onClose={() => setCancelModalOpen(false)}
                    title={t("confirmationModal.appointment.cancelTitle")}
                    size="md"
                >
                    <Textarea
                        className="w-full h-32 p-2 border border-gray-300 rounded"
                        placeholder={t("placeholder.reason")}
                        value={cancelDescription}
                        onChange={(e) => setCancelDescription(e.target.value)}
                    />
                    <div className="flex justify-end mt-4 gap-2">
                        <Button
                            className="bg-white text-black px-4 py-2 rounded border hover:bg-gray-100"
                            onClick={() => setCancelModalOpen(false)}
                            disabled={isProcessing}
                        >
                            {t("button.cancel")}
                        </Button>
                        <Button
                            className="bg-red-600 text-white px-4 py-2 rounded border hover:bg-red-700"
                            onClick={handleConfirmAction}
                            disabled={isProcessing || !cancelDescription.trim()}
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
function setCurrentApointment(arg0: null) {
    throw new Error("Function not implemented.");
}

