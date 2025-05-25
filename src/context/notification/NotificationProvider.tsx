"use client";

import React, { useEffect, useState } from "react";
import { NotificationProviderPropsType } from "./NotificationContext.types";
import { NotificationContext } from "./NotificationContext";
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
        "[NOTIFICATION-SOCKET] Session not found, skipping socket connection"
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
      console.log("[NOTIFICATION-SOCKET] Connected to WebSocket server");
    });

    newSocket.on("disconnect", () => {
      console.warn("[NOTIFICATION-SOCKET] Disconnected from WebSocket server");
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
