import { useNotifications } from "@/lib/queries/useNotification";
import { Bell } from "lucide-react";
import Link from "next/link";

export default function NotificationBadge() {
  const { unreadCount } = useNotifications();

  return (
    <Link href="/notifications" className="relative">
      <Bell className="h-5 w-5" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </Link>
  );
}
