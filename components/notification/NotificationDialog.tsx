import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useNotifications,
  useMarkAllNotificationsAsRead,
} from "@/lib/queries/useNotification";
import NotificationCard from "./NotificationCard";
import Link from "next/link";
import { cn } from "@/utils";

interface NotificationDialogProps {
  className?: string;
}

const NotificationDialog: React.FC<NotificationDialogProps> = (
  {
    // className,
  }
) => {
  const { notifications, unreadCount, isLoading, error } = useNotifications();
  const { markAllAsRead, isLoading: markingAllAsRead } =
    useMarkAllNotificationsAsRead();

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-full hover:bg-accent/50"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className={cn("w-full sm:max-w-sm p-0")}>
        <SheetHeader className="p-4 border-b">
          <div className="flex justify-between items-center">
            <SheetTitle>Notifications</SheetTitle>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllAsRead}
                disabled={markingAllAsRead}
              >
                Mark all as read
              </Button>
            )}
          </div>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Loading notifications...
            </div>
          ) : error ? (
            <div className="p-4 text-center text-sm text-red-500">
              Failed to load notifications
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No notifications yet
            </div>
          ) : (
            <div className="divide-y">
              {notifications.slice(0, 5).map((notification) => (
                <div key={notification.id} className="p-4">
                  <NotificationCard notification={notification} />
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="p-4 border-t mt-auto">
          <Button variant="outline" className="w-full" asChild>
            <Link href="/notifications">View all notifications</Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default NotificationDialog;
