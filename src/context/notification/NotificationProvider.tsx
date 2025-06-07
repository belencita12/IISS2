//manejamos la conexión real con el servidor
"use client";

import React, { useEffect, useState } from "react";
import { NotificationProviderPropsType } from "./NotificationContext.types";
import { NotificationContext } from "./NotificationContext";
import { io, Socket } from "socket.io-client";
import { BASE_API_URL } from "@/lib/env";
import { useSession } from "next-auth/react";
import { NotificationEvents } from "./notification-events.enum";
import { toast } from "@/lib/toast";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BellIcon } from "lucide-react";
import { formatDate } from "@/lib/utils";

// Definir el tipo de payload de notificación según la documentación
export type NotificationPayload = {
  id: number;
  title: string;
  description: string;
  type: "ALERT" | "APPOINTMENT_REMINDER" | "VACCINE_REMAINDER" | "INFO" | string;
  scope: "TO_USER" | string;
  isRead: boolean;
  arrivalDate: string;
};

export const NotificationProvider = ({
  children,
}: NotificationProviderPropsType) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      console.warn(
        "[NOTIFICACIÓN-SOCKET] Sesión no encontrada, se omite la conexión con el socket"
      );
      return;
    }

    const newSocket = io(BASE_API_URL, {
      reconnection: true,
      reconnectionAttempts: 3,
      reconnectionDelay: 1500,
      extraHeaders: { Authorization: `Bearer ${session.user.token}` },
    });

    newSocket.on("connect", () => {
      console.log("[NOTIFICACIÓN-SOCKET] Conectado al servidor WebSocket");
    });

    newSocket.on("disconnect", () => {
      console.warn("[NOTIFICACIÓN-SOCKET] Desconectado del servidor WebSocket");
    });

    // Listener para notificaciones en tiempo real
    const handleNotification = (payload: NotificationPayload) => {
      if (!payload.isRead) {
        let toastType: string;
        
        switch (payload.type) {
          case 'ALERT':
            toastType = 'orangered';
            break;
          case 'APPOINTMENT_REMINDER':
            toastType = 'green';
            break;
          case 'VACCINE_REMAINDER':
            toastType = 'green';
            break;
          case 'INFO':
            toastType = 'blue';
            break;
          default:
            toastType = 'red';
        }
        
        // toast personalizado con icono, estilo y acción
        toast("info",`${payload.title} (${formatDate(payload.arrivalDate)})`, {
          icon: <BellIcon/>,
          duration: 5000,
          description: payload.description,

          //Se establece un estilo personalizado para el toast
          unstyled: true,
          style: {
            color: `${toastType}`,
            fontSize: "1.25rem",
            border: "1px solid lightgray",
            padding: "0.75rem 1.25rem",
            borderRadius: "0.5rem",
          },

          //Botón para redirigir a la página de notifcaciones en base al rol del usuario
          action: <Button className="text-gray-700 w-full mt-4 p-4" variant="outline" onClick={() => {
            if (session.user.roles.includes("USER")) {
              router.push("/user-profile/notifications");
            } else {
              router.push("/dashboard/notifications");
            }
          }}>Ver notificaciones</Button>
        });
      }
    };
    newSocket.on(NotificationEvents.NOTIFICATION, handleNotification);

    setSocket(newSocket);

    return () => {
      newSocket.off(NotificationEvents.NOTIFICATION, handleNotification);
      newSocket.disconnect();
      setSocket(null);
    };
  }, [session, router]);

  return (
    <NotificationContext.Provider value={{ socket }}>
      {children}
    </NotificationContext.Provider>
  );
};