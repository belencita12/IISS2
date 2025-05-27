import { useContext } from "react";
import { NotificationContext } from "@/context/notification/notificationContext";

export const useNotification = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error(
      "useNotification debe ser usado dentro de un NotificationProvider"
    );
  }
  return ctx;
};