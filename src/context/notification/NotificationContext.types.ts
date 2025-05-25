import { ReactNode } from "react";
import { Socket } from "socket.io-client";

export type NotificationContextType = {
  socket: Socket | null;
};

export type NotificationProviderPropsType = {
  children: ReactNode;
};
