import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Bell, MessageCircle, UserPlus, Users, Heart } from "lucide-react";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { useNotifications } from "@/lib/queries/useNotification";
import { NotificationType } from "@/types/notification";
import { timeAgo } from "@/utils";
import Link from "next/link";

const WhatsNew = () => {
  const { notifications } = useNotifications();

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.NEW_FOLLOWER:
        return <Users className="h-3 w-3" />;
      case NotificationType.FRIEND_REQUEST:
      case NotificationType.FRIEND_ACCEPT:
        return <UserPlus className="h-3 w-3" />;
      case NotificationType.NEW_MESSAGE:
        return <MessageCircle className="h-3 w-3" />;
      case NotificationType.POST_LIKE:
        return <Heart className="h-3 w-3" />;
      case NotificationType.POST_COMMENT:
        return <MessageCircle className="h-3 w-3" />;
      default:
        return <Bell className="h-3 w-3" />;
    }
  };

  const getIconBackground = (type: NotificationType) => {
    switch (type) {
      case NotificationType.NEW_FOLLOWER:
        return "bg-blue-100 text-blue-600";
      case NotificationType.FRIEND_REQUEST:
      case NotificationType.FRIEND_ACCEPT:
        return "bg-green-100 text-green-600";
      case NotificationType.NEW_MESSAGE:
        return "bg-purple-100 text-purple-600";
      case NotificationType.POST_LIKE:
        return "bg-red-100 text-red-600";
      case NotificationType.POST_COMMENT:
        return "bg-orange-100 text-orange-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Bell className="h-4 w-4" /> What&apos;s New
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {notifications.slice(0, 3).map((notification, index) => (
          <React.Fragment key={notification.id}>
            {index > 0 && <Separator />}
            <Link href={`/notifications`} className="block">
              <div className="py-2 px-4 hover:bg-accent/20 cursor-pointer">
                <div className="flex items-center gap-2">
                  <div
                    className={`${getIconBackground(
                      notification.type
                    )} rounded-full p-1`}
                  >
                    {getNotificationIcon(notification.type)}
                  </div>
                  <span className="text-sm font-medium">
                    {notification.content}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground ml-6 mt-0.5">
                  {timeAgo(notification.createdAt)}
                </p>
              </div>
            </Link>
          </React.Fragment>
        ))}
        {notifications.length === 0 && (
          <div className="py-4 px-4 text-center text-sm text-muted-foreground">
            No new notifications
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="ghost" size="sm" className="w-full text-sm" asChild>
          <Link href="/notifications">View all notifications</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WhatsNew;
