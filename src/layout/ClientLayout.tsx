"use client";

import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { NotificationProvider } from "@/context/notification/notificationProvider";

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <NotificationProvider>{children}</NotificationProvider>
    </SessionProvider>
  );
}
