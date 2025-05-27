//manejamos la conexión real con el servidor
"use client";

import React, { useEffect, useState } from "react";
import { NotificationProviderPropsType } from "./notificationContext.types";
import { NotificationContext } from "./notificationContext";
import { io, Socket } from "socket.io-client";
import { BASE_API_URL } from "@/lib/env";
import { useSession } from "next-auth/react";

export const NotificationProvider = ({
  children,
}: NotificationProviderPropsType) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { data: session } = useSession();

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

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
      setSocket(null);
    };
  }, [session]);

  return (
    <NotificationContext.Provider value={{ socket }}>
      {children}
    </NotificationContext.Provider>
  );
};