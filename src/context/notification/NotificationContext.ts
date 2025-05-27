//creamos el contexto
import { createContext } from "react";
import { NotificationContextType } from "./NotificationContext.types";

export const NotificationContext =
  createContext<NotificationContextType | null>(null);