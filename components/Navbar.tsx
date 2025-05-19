import { useState } from "react";
import { Menu, Search, User, X } from "lucide-react";
import NotificationDialog from "./notification/NotificationDialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import { DEFAULT_USER_IMG } from "@/constants";

const Navbar = () => {
  const user = useAuthStore((state) => state.user);
  // const [isSearchActive, setIsSearchActive] = useState<boolean>(false);
  const [isMobileSearchVisible, setIsMobileSearchVisible] =
    useState<boolean>(false);

  const mobileNavItems = [
    // { icon: Home, label: "Home", href: "/feed" },
    { icon: Search, label: "Search", href: "/search" },
    // { icon: MessageCircle, label: "Messages", href: "/messages" },
    { icon: User, label: "Profile", href: "/profile" },
  ];

  const toggleMobileSearch = () => {
    setIsMobileSearchVisible(!isMobileSearchVisible);
  };

  return (
    <header className="sticky top-0 z-10 w-full bg-background/80 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="w-full flex items-center justify-between h-16 px-4">
        {/* Logo and Search */}
        <div className="flex items-center gap-4 flex-1">
          <Link
            href="/feed"
            className="font-bold text-xl flex items-center gap-2 transition-all hover:scale-105"
          >
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white">
              S
            </div>
            <span className="hidden sm:inline">SocialApp</span>
          </Link>

          {/* <div
            className={cn(
              "hidden lg:flex relative transition-all duration-300 flex-1 max-w-2xl",
              isSearchActive ? "w-full" : "w-full"
            )}
          >
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-10 pr-4 h-10 rounded-full border-accent bg-accent/5 focus-visible:bg-background transition-colors w-full"
              onFocus={() => setIsSearchActive(true)}
              onBlur={() => setIsSearchActive(false)}
            />
          </div> */}
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-2">
          {mobileNavItems.map((item) => (
            <Button
              key={item.href}
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-accent/50"
              asChild
            >
              <Link href={item.href} className="relative group">
                <item.icon className="h-5 w-5 transition-transform group-hover:scale-110" />
                <span className="sr-only">{item.label}</span>
              </Link>
            </Button>
          ))}
          <NotificationDialog />
        </nav>

        {/* User and Mobile Menu */}
        <div className="flex items-center gap-2">
          {/* Mobile Search Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden rounded-full hover:bg-accent/50"
            onClick={toggleMobileSearch}
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* Avatar with status indicator */}
          <div className="relative">
            <Avatar className="h-9 w-9 border-2 border-background transition-transform hover:scale-105">
              <AvatarImage src={user?.avatar || DEFAULT_USER_IMG} alt="User" />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                U
              </AvatarFallback>
            </Avatar>
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-background"></span>
          </div>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden rounded-full hover:bg-accent/50"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[80%] sm:w-[300px] p-0">
              <div className="flex flex-col h-full">
                <div className="p-4 border-b flex items-center justify-between">
                  <span className="font-bold text-lg">Menu</span>
                  <SheetTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                </div>

                <div className="p-4 flex flex-col gap-1 flex-1 overflow-y-auto">
                  {mobileNavItems.map((item) => (
                    <Button
                      key={item.href}
                      variant="ghost"
                      className="w-full justify-start"
                      asChild
                    >
                      <Link
                        href={item.href}
                        className="flex items-center gap-3 py-2"
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </Link>
                    </Button>
                  ))}
                </div>

                <div className="mt-auto p-4 border-t">
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user?.avatar} alt="User" />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {" "}
                        {user?.firstName} {user?.lastName}{" "}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        @{user?.username}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    Log Out
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Mobile Search Bar - Conditionally rendered */}
      {isMobileSearchVisible && (
        <div className="lg:hidden border-t border-border p-2 flex items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-10 pr-4 h-10 rounded-full border-accent bg-accent/5 focus-visible:bg-background"
              autoFocus
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="ml-2 rounded-full hover:bg-accent/50"
            onClick={toggleMobileSearch}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
