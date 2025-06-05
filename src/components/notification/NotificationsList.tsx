"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import GenericPagination from "@/components/global/GenericPagination";
import { BellIcon, CheckCircle2, Filter, X } from "lucide-react";
import SearchBar from "../global/SearchBar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import NotificationsListSkeleton from "./NotificationsListSkeleton";
import { SelectOptions } from "@/components/global/FormSelect";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { NotificationCard } from "./NotificationCard";
import { useNotification } from "@/hooks/notification/useNotification";
import { useState } from "react";

interface NotificationsListProps {
  token: string;
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

export default function NotificationsList({ token }: NotificationsListProps) {
  const {
    notifications,
    total,
    loading,
    filters,
    page,
    size,
    markAllLoading,
    markReadLoading,
    handleSearch,
    updateFilters,
    handleMarkRead,
    handleMarkAllRead,
    setPage,
    resetFilters,
  } = useNotification(token);

  const [showMobileFilters, setShowMobileFilters] = useState(true);

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
    <div className="min-h-screen bg-gradient-to-br from-violet-100 via-fuchsia-100 to-white pb-10">
      <div className="relative bg-gradient-to-r from-myPurple-primary to-myPink-primary py-8">
        <div className="container mx-auto px-16">
          <div className="flex items-center gap-3">
            <BellIcon className="w-8 h-8 text-white" />
            <h1 className="text-3xl font-bold text-white">Notificaciones</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SearchBar
          onSearch={handleSearch}
          placeholder="Buscar notificaciones..."
          debounceDelay={500}
        />
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filtros*/}
          <aside
            className={`
    ${showMobileFilters ? "block" : "hidden"} 
    lg:block 
    lg:col-span-1 lg:sticky top-4 
    bg-gray-50 rounded-lg border shadow-sm p-5 space-y-5 h-fit lg:max-h-screen lg:overflow-auto
  `}
          >
            <div className="flex items-center space-x-2 mb-4">
              <Filter className="h-5 w-5" />
              <h3 className="text-lg font-semibold">Filtros</h3>
            </div>
            <div className="space-y-4">
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
              <Separator />
              {/* Date Range Filter */}
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
            <div className="mt-6 space-y-3">
              <Button
                variant="outline"
                className="w-full h-9 p-4 bg-gradient-to-r from-myPurple-disabled to-myPink-disabled text-myPurple-primary hover:from-myPurple-tertiary hover:to-myPink-tertiary hover:text-myPurple-focus"
                onClick={resetFilters}
              >
                Limpiar filtros
              </Button>
            </div>
          </aside>
          {/* Mobile Filter Toggle - Fuera de la aside para controlar su visibilidad de manera independiente */}
          <div className="lg:hidden mb-4">
            <Button
              variant="outline"
              className="w-full flex items-center justify-center space-x-2"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
            >
              {showMobileFilters ? (
                <X className="h-4 w-4" />
              ) : (
                <Filter className="h-4 w-4" />
              )}
              <span>
                {showMobileFilters ? "Ocultar filtros" : "Mostrar filtros"}
              </span>
            </Button>
          </div>
          <div className="w-full lg:col-span-3 space-y-6">
            {/* Barra de acciones */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 justify-between items-start sm:items-center">
              <Button
                className="bg-gradient-to-r from-myPurple-primary to-myPink-primary hover:from-myPurple-hover hover:to-myPink-hover text-white"
                onClick={handleMarkAllRead}
                disabled={markAllLoading}
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                {markAllLoading ? "Marcando..." : "Marcar todo como leído"}
              </Button>
              <span className="text-gray-500">{`Mostrando ${total === 0 ? 0 : (page - 1) * size + 1} - ${total === 0 ? 0 : Math.min(page * size, total)} de ${total}`}</span>
            </div>

            {/* Lista de notificaciones */}
            <div className="w-full space-y-3">
              {loading ? (
                <NotificationsListSkeleton />
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
                  <NotificationCard
                    key={n.id}
                    notification={n}
                    onMarkRead={handleMarkRead}
                    isMarking={markReadLoading}
                  />
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
