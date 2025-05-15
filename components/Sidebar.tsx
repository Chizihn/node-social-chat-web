// Sidebar.jsx
import { useState } from "react";
import {
  Bell,
  Home,
  MessageCircle,
  Settings,
  User,
  Users,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

const Sidebar = () => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { logout } = useAuthStore();

  const navItems = [
    { icon: Home, label: "Home", href: "/feed" },
    // { icon: Search, label: "Explore", href: "/explore" },
    { icon: Users, label: "Friends", href: "/friends" },
    { icon: MessageCircle, label: "Messages", href: "/messages" },
    { icon: Bell, label: "Notifications", href: "/notifications" },
    { icon: User, label: "Profile", href: "/profile" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ];

  const handleLogout = () => {
    logout();
    window.location.reload();
  };
  return (
    <aside
      className={cn(
        "hidden md:flex flex-col transition-all duration-300 border-r border-border h-[calc(100vh-4rem)] sticky top-16 bg-background/80 backdrop-blur-sm",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <Button
        variant="ghost"
        size="sm"
        className="self-end mr-2 mt-2 rounded-full"
        onClick={() => setCollapsed(!collapsed)}
      >
        <ChevronRight
          className={cn(
            "h-4 w-4 transition-transform",
            collapsed ? "" : "rotate-180"
          )}
        />
      </Button>

      <nav className="p-3 space-y-1 flex-1 overflow-y-auto scrollbar-thin">
        {navItems.map((item) => (
          <Button
            key={item.href}
            variant="ghost"
            className={cn(
              "w-full transition-all duration-200 hover:bg-accent/50",
              collapsed ? "justify-center px-2" : "justify-start"
            )}
            asChild
          >
            <Link
              href={item.href}
              className={`flex items-center gap-3 py-2 rounded-lg group ${
                pathname.includes(item.href) ? "text-primary" : ""
              } `}
            >
              <item.icon
                className={cn(
                  "transition-all duration-200 group-hover:scale-110",
                  collapsed ? "h-5 w-5" : "h-4 w-4"
                )}
              />
              {!collapsed && <span className="font-medium">{item.label}</span>}
            </Link>
          </Button>
        ))}
      </nav>

      <div
        className={cn(
          "border-t border-border p-3 mt-auto",
          collapsed ? "text-center" : ""
        )}
      >
        {/* <Button
          variant="outline"
          className={cn(
            "w-full transition-all",
            collapsed ? "justify-center px-2" : "justify-start"
          )}
        >
          <User className="h-4 w-4 mr-2" />
          {!collapsed && <span>Account</span>}
        </Button> */}
        <Button
          variant="danger"
          className={cn(
            "w-full transition-all",
            collapsed ? "justify-center px-2" : "justify-start"
          )}
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          {!collapsed && <span>Logout</span>}
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
