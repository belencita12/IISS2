import { useState, useContext, useEffect } from 'react';
import { useFetch } from '@/hooks/api/useFetch';
import { NOTIFICATION_API } from '@/lib/urls';
import { toast } from '@/lib/toast';
import { Notification } from '@/lib/notifications/utils';
import { NotificationContext } from '@/context/notification/NotificationContext';

export const useNotification = (token: string, userId: number) => {
  // Context
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error(
      "useNotification debe ser usado dentro de un NotificationProvider"
    );
  }

  // Estado local y lógica de notificaciones
  const [page, setPage] = useState(1);
  const [size] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    type: "ALL",
    scope: "ALL",
    isRead: "ALL",
    dateFrom: "",
    dateTo: "",
    userId: userId,
  });

  // Hooks de fetch
  const { data, loading, error, execute } = useFetch<{ data: Notification[]; total: number }>(
    NOTIFICATION_API,
    token,
    { immediate: false }
  );

  const { execute: executeMarkAllRead, loading: markAllLoading } = useFetch(
    '/notification/read/all',
    token,
    { immediate: false }
  );

  const { execute: executeMarkRead, loading: markReadLoading } = useFetch(
    '/notification/read',
    token,
    { immediate: false }
  );

  // Funciones auxiliares
  const buildParams = (currentPage = page) => new URLSearchParams({
    page: currentPage.toString(),
    size: size.toString(),
    ...(searchQuery && { searchContent: searchQuery }),
    ...(filters.type !== "ALL" && { type: filters.type }),
    ...(filters.scope !== "ALL" && { scope: filters.scope }),
    ...(filters.isRead !== "ALL" && { isRead: filters.isRead }),
    ...(filters.dateFrom && { fromArrivalDate: filters.dateFrom }),
    ...(filters.dateTo && { toArrivalDate: filters.dateTo }),
    ...(filters.userId !== undefined && filters.userId !== null && { userId: filters.userId.toString() }),
  });

  useEffect(() => {
    execute(undefined, `${NOTIFICATION_API}?${buildParams()}`);
  }, [page, filters, searchQuery]);

  // Handlers
const updateFilters = (key: string, value: string) => {
  const updatedFilters = { ...filters, [key]: value };
  setFilters(updatedFilters);
  setPage(1);
};

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };

  const handleMarkRead = async (id: number) => {
    try {
      const { ok, error } = await executeMarkRead(null, `${NOTIFICATION_API}/read/${id}`, 'PATCH');
      if (!ok) throw new Error(error?.message);
      toast("success", "Notificación marcada como leída");
      execute(undefined, `${NOTIFICATION_API}?${buildParams()}`);
    } catch (err) {
      toast("error", err instanceof Error ? err.message : "Error desconocido");
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const { ok, error } = await executeMarkAllRead(null, `${NOTIFICATION_API}/read/all`, 'PATCH');
      if (!ok) throw new Error(error?.message);
      toast("success", "Todas las notificaciones marcadas como leídas");
      execute(undefined, `${NOTIFICATION_API}?${buildParams()}`);
    } catch (err) {
      toast("error", err instanceof Error ? err.message : "Error desconocido");
    }
  };

  const resetFilters = () => {
  setFilters({
    type: "ALL",
    scope: "ALL",
    isRead: "ALL",
    dateFrom: "",
    dateTo: "",
    userId: userId,
  });
  setPage(1);
};
  

  return {
    // Estado del contexto
    ...ctx,
    
    // Estado y datos de la lista
    notifications: data?.data || [],
    total: data?.total || 0,
    loading,
    error,
    page,
    size,
    filters,
    searchQuery,
    markAllLoading,
    markReadLoading,
    
    // Métodos
    setPage,
    handleSearch,
    updateFilters,
    handleMarkRead,
    handleMarkAllRead,
    execute,
    resetFilters,
  };
};