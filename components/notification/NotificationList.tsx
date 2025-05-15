import { Notifications } from "@/types/notification";
import React from "react";
import NotificationCard from "./NotificationCard";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMarkAllNotificationsAsRead } from "@/lib/queries/useNotification";

interface NotificationListProps {
  notifications: Notifications;
  unreadCount: number;
  loading: boolean;
  error: string | null;
}

const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  unreadCount,
  loading,
  error,
}) => {
  const { markAllAsRead, isLoading: markingAllAsRead } =
    useMarkAllNotificationsAsRead();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <p>Loading notifications...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div>
      {unreadCount > 0 && (
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm font-medium">
            You have {unreadCount} unread notification
            {unreadCount !== 1 ? "s" : ""}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => markAllAsRead()}
            disabled={markingAllAsRead}
          >
            Mark all as read
          </Button>
        </div>
      )}

      {notifications?.length > 0 ? (
        <div className="space-y-1">
          {notifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-muted/20 rounded-lg">
          <Bell className="mx-auto h-16 w-16 text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-xl font-medium mb-2">No notifications</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            When you receive notifications, you&apos;ll see them here
          </p>
        </div>
      )}
    </div>
  );
};

export default NotificationList;
