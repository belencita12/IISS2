import { Badge } from "@/components/ui/badge";
import { AlertTriangleIcon, BellIcon, Calendar, InfoIcon, SyringeIcon, User, Users } from "lucide-react";

export interface Notification {
    id: number;
    title: string;
    description: string;
    type: "INFO" | "ALERT" | "APPOINTMENT_REMINDER" | "VACCINE_REMAINDER";
    scope: "BROADCAST" | "TO_USER";
    isRead: boolean;
    arrivalDate: string;
}

  export const getTypeIcon = (type: string) => {
    switch (type) {
      case "ALERT":
        return <AlertTriangleIcon className="h-4 w-4" />;
      case "INFO":
        return <InfoIcon className="h-4 w-4" />;
      case "APPOINTMENT_REMINDER":
        return <Calendar className="h-4 w-4" />;
      case "VACCINE_REMAINDER":
        return <SyringeIcon className="h-4 w-4" />;
      default:
        return <BellIcon className="h-4 w-4" />;
    }
  };

  export const getTypeColor = (type: string) => {
    switch (type) {
      case "ALERT":
        return "bg-red-100 text-red-800 border-red-200";
      case "INFO":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "APPOINTMENT_REMINDER":
        return "bg-green-100 text-green-800 border-green-200";
      case "VACCINE_REMAINDER":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  export const getTypeBadge = (type: Notification["type"]) => {
    switch (type) {
      case "ALERT":
        return (
          <Badge
            variant="outline"
            className={`${getTypeColor(type)} text-xs px-1.5 py-0.5`}
          >
            ALERTA
          </Badge>
        );
      case "INFO":
        return (
          <Badge
            variant="outline"
            className={`${getTypeColor(type)} text-xs px-1.5 py-0.5`}
          >
            INFO
          </Badge>
        );
      case "APPOINTMENT_REMINDER":
        return (
          <Badge
            variant="outline"
            className={`${getTypeColor(type)} text-xs px-1.5 py-0.5`}
          >
            RECORDATORIO DE CITA
          </Badge>
        );
      case "VACCINE_REMAINDER":
        return (
          <Badge
            variant="outline"
            className={`${getTypeColor(type)} text-xs px-1.5 py-0.5`}
          >
            RECORDATORIO DE VACUNA
          </Badge>
        );
      default:
        return null;
    }
  };
  export const getScopeIcon = (scope: string) => {
    return scope === "BROADCAST" ? (
      <Users className="h-3 w-3" />
    ) : (
      <User className="h-3 w-3" />
    );
  };