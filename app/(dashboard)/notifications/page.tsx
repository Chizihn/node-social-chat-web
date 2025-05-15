"use client";

import {
  useNotifications,
  useMarkAllNotificationsAsRead,
} from "@/lib/queries/useNotification";
import NotificationList from "@/components/notification/NotificationList";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";

export default function NotificationsPage() {
  const { notifications, unreadCount, isLoading, error } = useNotifications();
  const { markAllAsRead, isLoading: markingAllAsRead } =
    useMarkAllNotificationsAsRead();

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  return (
    <div className=" py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notifications
        </h1>
        {unreadCount > 0 && (
          <Button
            onClick={handleMarkAllAsRead}
            disabled={markingAllAsRead}
            variant="outline"
          >
            Mark all as read
          </Button>
        )}
      </div>

      <div className="bg-background rounded-lg shadow">
        <NotificationList
          notifications={notifications}
          unreadCount={unreadCount}
          loading={isLoading}
          error={error ? String(error) : null}
        />
      </div>
    </div>
  );
}
