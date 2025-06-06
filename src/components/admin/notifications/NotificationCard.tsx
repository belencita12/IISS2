"use client";

import {
  getScopeIcon,
  getTypeIcon,
  Notification,
} from "@/lib/notifications/utils";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CheckCheckIcon } from "lucide-react";

interface NotificationCardProps {
  notification: Notification;
  onChange?: () => void;
  isProcessing?: boolean;
  setIsProcessing?: (value: boolean) => void;
  onMarkAsRead?: (id: number) => void;
}

const formatTypeFilter = (type: string) => {
  switch (type) {
    case "ALERT":
      return "ALERTA";
    case "INFO":
      return "INFO";
    case "APPOINTMENT_REMINDER":
      return "RECORDATORIO DE CITA";
    case "VACCINE_REMAINDER":
      return "RECORDATORIO DE VACUNA";
    default:
      return type;
  }
};

const formatScopeFilter = (scope: string) => {
  switch (scope) {
    case "BROADCAST":
      return "Difusión";
    case "TO_USER":
      return "Personal";
    default:
      return scope;
  }
};

const NotificationCard = ({
  notification,
  isProcessing = false,
  onMarkAsRead
}: NotificationCardProps) => {
  return (
    <div className="border p-4 rounded-lg flex flex-col justify-between items-start bg-white shadow transition-transform duration-300 hover:shadow-md hover:-translate-y-1">
      <div className="w-full flex items-start justify-between mb-2">
        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-xs sm:text-xl">{notification.title}</h3>
          <p className="text-xs sm:text-lg overflow-hidden break-words max-w-40 sm:max-w-xs lg:max-w-xl">
            {notification.description}
          </p>
        </div>

        <div className="flex flex-col items-end justify-between h-full gap-2">
          <p className="text-black text-xs sm:text-lg font-bold text-right whitespace-nowrap">
            {notification.arrivalDate
              ? formatDate(notification.arrivalDate)
              : ""}
          </p>

            <div className="flex gap-2">
          {notification.isRead ? (
              <Button
                className="cursor-default text-xs md:text-md px-3 py-1 bg-white text-black rounded border border-gray-300 hover:bg-gray-100"
              >
                <CheckCheckIcon/>
                Leído
              </Button>
          ) : (
              <Button
                variant="default"
                disabled={isProcessing}
                onClick={() => {
                  onMarkAsRead?.(notification.id);
                }}
                className="text-xs md:text-md px-3 py-1 rounded">
                Marcar leído
              </Button>
          )}
            </div>
        </div>
      </div>
      <div className="flex items-center gap-4 text-xs sm:text-sm font-medium text-gray-600">
        <div className="flex items-center gap-1">
          {getScopeIcon(notification.scope)}
          {formatScopeFilter(notification.scope)}
        </div>
        <div className="flex items-center gap-1">
          {getTypeIcon(notification.type)}
          {formatTypeFilter(notification.type)}
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;
