import { Notification, NotificationType } from "@/types/notification";
import { formatDistanceToNow } from "date-fns";
import { Bell, Heart, MessageCircle, UserPlus, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { X } from "lucide-react";
import {
  useDeleteNotification,
  useMarkNotificationAsRead,
} from "@/lib/queries/useNotification";

interface NotificationCardProps {
  notification: Notification;
}

const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
}) => {
  const { markAsRead } = useMarkNotificationAsRead();
  const { deleteNotification, isLoading: deleting } = useDeleteNotification();
  const [isHovering, setIsHovering] = useState(false);

  const handleMarkAsRead = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!notification.read) {
      await markAsRead(notification.id);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await deleteNotification(notification.id);
  };

  const getNotificationIcon = () => {
    switch (notification.type) {
      case NotificationType.NEW_FOLLOWER:
        return <Users className="h-5 w-5 text-blue-500" />;
      case NotificationType.FRIEND_REQUEST:
        return <UserPlus className="h-5 w-5 text-green-500" />;
      case NotificationType.FRIEND_ACCEPT:
        return <UserPlus className="h-5 w-5 text-green-500" />;
      case NotificationType.NEW_MESSAGE:
        return <MessageCircle className="h-5 w-5 text-purple-500" />;
      case NotificationType.POST_LIKE:
        return <Heart className="h-5 w-5 text-red-500" />;
      case NotificationType.POST_COMMENT:
        return <MessageCircle className="h-5 w-5 text-orange-500" />;
      case NotificationType.MENTION:
        return <Bell className="h-5 w-5 text-yellow-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getNotificationLink = () => {
    switch (notification.type) {
      case NotificationType.NEW_FOLLOWER:
      case NotificationType.FRIEND_REQUEST:
      case NotificationType.FRIEND_ACCEPT:
        return `/profile/${notification.sender.id}`;
      case NotificationType.NEW_MESSAGE:
        return `/messages/${notification.entityId}`;
      case NotificationType.POST_LIKE:
      case NotificationType.POST_COMMENT:
      case NotificationType.MENTION:
        return `/posts/${notification.entityId}`;
      default:
        return "#";
    }
  };

  return (
    <Link
      href={getNotificationLink()}
      onClick={handleMarkAsRead}
      className="block"
    >
      <div
        className={`p-4 border rounded-lg mb-3 transition-all ${
          notification.read ? "bg-white" : "bg-blue-50"
        } hover:shadow-md`}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div className="flex items-start gap-3 relative">
          {notification.sender?.avatar ? (
            <Image
              src={notification.sender.avatar}
              alt={notification.sender.username || "User"}
              width={40}
              height={40}
              className="rounded-full"
            />
          ) : (
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              {getNotificationIcon()}
            </div>
          )}

          <div className="flex-1">
            <p className="text-sm text-gray-800">{notification.content}</p>
            <p className="text-xs text-gray-500 mt-1">
              {formatDistanceToNow(new Date(notification.createdAt), {
                addSuffix: true,
              })}
            </p>
          </div>

          {isHovering && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-0 right-0 h-6 w-6"
              onClick={handleDelete}
              disabled={deleting}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </Link>
  );
};

export default NotificationCard;
