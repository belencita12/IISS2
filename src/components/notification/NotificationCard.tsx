
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getTypeIcon, getTypeColor, getTypeBadge, getScopeIcon } from "@/lib/notifications/utils";
import { Notification } from "@/lib/notifications/utils";
import { CheckCircle2Icon } from "lucide-react";


interface NotificationCardProps {
  notification: Notification;
  onMarkRead: (id: number) => void;
  isMarking?: boolean;
}

export const NotificationCard = ({ notification: n, onMarkRead, isMarking }: NotificationCardProps) => (
  <Card
    className={`transition-all hover:shadow-md ${
      !n.isRead
        ? "bg-gray-50 border-gray-200"
        : "bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 shadow-sm"
    }`}
  >
    <CardContent className="p-4">
      <div className="flex items-center justify-between space-x-3">
        <div
          className={`p-1.5 rounded-full ${getTypeColor(
            n.type
          )} flex-shrink-0`}
        >
          {getTypeIcon(n.type)}
        </div>

        <div className="flex-1 min-w-0 overflow-hidden w-0">
          <div className="flex items-center space-x-2 mb-1">
            <h3
              className={`font-medium text-gray-900 line-clamp-1 text-ellipsis break-words ${
                !n.isRead ? "font-semibold" : ""
              }`}
            >
              {n.title}
            </h3>
            {!n.isRead && (
              <div className="flex-shrink-0">
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-0.5">
                  Nuevo
                </Badge>
              </div>
            )}
          </div>
          <p className="text-sm text-gray-600 mb-2 line-clamp-2 text-ellipsis break-words">
            {n.description}
          </p>
          <div className="flex items-center space-x-3 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <span>
                {n.arrivalDate
                  ? format(
                      new Date(n.arrivalDate),
                      "dd/MM/yyyy"
                    )
                  : ""}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              {getScopeIcon(n.scope)}
              <span>
                {n.scope === "BROADCAST"
                  ? "Difusión"
                  : "Personal"}
              </span>
            </div>
              {getTypeBadge(n.type)}
          </div>
        </div>

        <div className="flex-shrink-0">
          {!n.isRead ? (
            <Button
              size="default"
              variant="outline"
              className="bg-gradient-to-r from-myPurple-disabled to-myPink-disabled text-myPurple-primary hover:from-myPurple-tertiary hover:to-myPink-tertiary h-8 p-4 hover:text-myPurple-focus"
              onClick={() => onMarkRead(n.id)}
              disabled={isMarking}
            >
                {isMarking ? "Marcando..." : "Marcar leído"}
            </Button>
          ) : (
            <div className="flex items-center justify-start space-x-1 text-myPurple-primary text-xs">
                <CheckCircle2Icon className="h-6 w-6 mr-2" />
            </div>
          )}
        </div>
      </div>
    </CardContent>
  </Card>
);