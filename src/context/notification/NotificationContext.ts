//creamos el contexto
import { createContext } from "react";
import { NotificationContextType } from "./notificationContext.types";

export const NotificationContext =
  createContext<NotificationContextType | null>(null);