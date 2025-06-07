"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import GenericPagination from "@/components/global/GenericPagination";
import { BellIcon, CheckCircle2, EraserIcon } from "lucide-react";
import SearchBar from "@/components/global/SearchBar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import NotificationListSkeleton from "./skeleton/NotificationListSkeleton";
import { SelectOptions } from "@/components/global/FormSelect";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import NotificationCard from "./NotificationCard";
import { useNotification } from "@/hooks/notification/useNotification";

interface NotificationsListProps {
  token: string;
  userId: number;
}

export interface Notification {
  id: number;
  title: string;
  description: string;
  type: "INFO" | "ALERT" | "APPOINTMENT_REMINDER" | "VACCINE_REMAINDER";
  scope: "BROADCAST" | "TO_USER";
  isRead: boolean;
  arrivalDate: string;
}

const NOTIFICATION_TYPES: SelectOptions[] = [
  { value: "ALL", label: "Todos" },
  { value: "INFO", label: "Info" },
  { value: "ALERT", label: "Alerta" },
  { value: "APPOINTMENT_REMINDER", label: "Recordatorio de cita" },
  { value: "VACCINE_REMAINDER", label: "Recordatorio de vacuna" },
];

const SCOPE_TYPES: SelectOptions[] = [
  { value: "ALL", label: "Todos" },
  { value: "BROADCAST", label: "Difusión" },
  { value: "TO_USER", label: "Personal" },
];

const READ_STATUS_TYPES: SelectOptions[] = [
  { value: "ALL", label: "Todos" },
  { value: "true", label: "Leídos" },
  { value: "false", label: "No leídos" },
];

export default function NotificationsList({
  token,
  userId,
}: NotificationsListProps) {
  const {
    notifications,
    total,
    loading,
    filters,
    page,
    size,
    markAllLoading,
    handleSearch,
    updateFilters,
    handleMarkAllRead,
    setPage,
    resetFilters,
    handleMarkRead,
  } = useNotification(token, userId);

  const MIN_DATE = "2000-01-01";
  const MAX_DATE = new Date().toISOString().split("T")[0];

  const validateAndFormatDate = (date: string, isFrom: boolean): string => {
    const selectedDate = new Date(date);
    const minDate = new Date(MIN_DATE);
    const maxDate = new Date(MAX_DATE);
    const otherDate = isFrom
      ? new Date(filters.dateTo || MAX_DATE)
      : new Date(filters.dateFrom || MIN_DATE);

    if (selectedDate < minDate) return MIN_DATE;
    if (selectedDate > maxDate) return MAX_DATE;

    if (isFrom && selectedDate > otherDate) return filters.dateTo || MAX_DATE;
    if (!isFrom && selectedDate < otherDate)
      return filters.dateFrom || MIN_DATE;

    return date;
  };

  const handleDateChange = (value: string, isFrom: boolean) => {
    const validatedDate = validateAndFormatDate(value, isFrom);
    const dateKey = isFrom ? "dateFrom" : "dateTo";

    updateFilters(dateKey, validatedDate);
  };

  // Handlers para paginación genérica
  const totalPages = Math.ceil(total / size);
  const handlePageChange = (newPage: number) => setPage(newPage);
  const handlePreviousPage = () => setPage((prev) => Math.max(1, prev - 1));
  const handleNextPage = () =>
    setPage((prev) => Math.min(totalPages, prev + 1));

  return (
    <div className="min-h-screen pb-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SearchBar
          onSearch={handleSearch}
          placeholder="Buscar notificaciones..."
          debounceDelay={500}
        />
        <div className="gap-8">
          {/* Filtros*/}
          <div className="bg-gray-50 rounded-lg border shadow-sm p-5 h-fit mb-8">
              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-sm h-8 px-2 text-gray-600 mr-[10px]"
                  onClick={resetFilters}
                >
                    <EraserIcon/>
                  Limpiar filtros
                </Button>
              </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Filtro por tipo de notificacion */}
              <div>
                <Label className="mb-1">Tipo de notificación</Label>
                <Select
                  value={filters.type || "ALL"}
                  onValueChange={(value) => updateFilters("type", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {NOTIFICATION_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Filtro de alcance  */}
              <div>
                <Label className="mb-1">Alcance</Label>
                <Select
                  value={filters.scope || "ALL"}
                  onValueChange={(value) => updateFilters("scope", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccionar alcance" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {SCOPE_TYPES.map((scope) => (
                      <SelectItem key={scope.value} value={scope.value}>
                        {scope.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* Filtro para el estado de la notificacion */}
              <div>
                <Label className="mb-1">Estado</Label>
                <Select
                  value={filters.isRead || "ALL"}
                  onValueChange={(value) => updateFilters("isRead", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {READ_STATUS_TYPES.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* Filtro de rango de fechas */}
              <div className="flex flex-col sm:flex-row gap-8 sm:gap-4">

              <div>
                <Label className="mb-1">Fecha Desde</Label>
                <Input
                  type="date"
                  className="h-9"
                  min={MIN_DATE}
                  max={MAX_DATE}
                  value={filters.dateFrom}
                  onChange={(e) => handleDateChange(e.target.value, true)}
                  onBlur={(e) => handleDateChange(e.target.value, true)}
                />
              </div>
              <div>
                <Label className="mb-1">Fecha Hasta</Label>
                <Input
                  type="date"
                  className="h-9"
                  min={filters.dateFrom || MIN_DATE}
                  max={MAX_DATE}
                  value={filters.dateTo}
                  onChange={(e) => handleDateChange(e.target.value, false)}
                  onBlur={(e) => handleDateChange(e.target.value, false)}
                />
              </div>
              </div>
            </div>
          </div>
          <div className="w-full lg:col-span-3 space-y-6">
            {/* Barra de acciones */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-10 sm:gap-0">
                <h3 className="text-3xl font-bold">Notificaciones</h3>
              <Button
                variant="default"
                onClick={handleMarkAllRead}
                disabled={markAllLoading}
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                {markAllLoading ? "Marcando..." : "Marcar todo como leído"}
              </Button>
            </div>

            {/* Lista de notificaciones */}
            <div className="w-full space-y-3">
              {loading ? (
                <NotificationListSkeleton />
              ) : notifications.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <BellIcon className="h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No hay notificaciones
                    </h3>
                    <p className="text-gray-500 text-center">
                      No se encontraron notificaciones que coincidan con los
                      filtros seleccionados.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                notifications.map((n) => (
                  <NotificationCard key={n.id} notification={n} onMarkAsRead={handleMarkRead} />
                ))
              )}
            </div>
            <div className="mt-8">
              <GenericPagination
                handlePreviousPage={handlePreviousPage}
                handlePageChange={handlePageChange}
                handleNextPage={handleNextPage}
                currentPage={page}
                totalPages={totalPages}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
