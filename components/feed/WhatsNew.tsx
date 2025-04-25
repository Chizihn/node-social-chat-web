import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Bell, MessageCircle, ThumbsUp, UserPlus } from "lucide-react";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";

const WhatsNew = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Bell className="h-4 w-4" /> What&apos;s New
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="py-2 px-4 hover:bg-accent/20 cursor-pointer">
          <div className="flex items-center gap-2">
            <div className="bg-blue-100 text-blue-600 rounded-full p-1">
              <ThumbsUp className="h-3 w-3" />
            </div>
            <span className="text-sm font-medium">Alex liked your post</span>
          </div>
          <p className="text-xs text-muted-foreground ml-6 mt-0.5">2m ago</p>
        </div>
        <Separator />
        <div className="py-2 px-4 hover:bg-accent/20 cursor-pointer">
          <div className="flex items-center gap-2">
            <div className="bg-purple-100 text-purple-600 rounded-full p-1">
              <UserPlus className="h-3 w-3" />
            </div>
            <span className="text-sm font-medium">
              Jamie sent a friend request
            </span>
          </div>
          <p className="text-xs text-muted-foreground ml-6 mt-0.5">1h ago</p>
        </div>
        <Separator />
        <div className="py-2 px-4 hover:bg-accent/20 cursor-pointer">
          <div className="flex items-center gap-2">
            <div className="bg-green-100 text-green-600 rounded-full p-1">
              <MessageCircle className="h-3 w-3" />
            </div>
            <span className="text-sm font-medium">
              New messages from Taylor
            </span>
          </div>
          <p className="text-xs text-muted-foreground ml-6 mt-0.5">3h ago</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="ghost" className="w-full text-sm" size="sm">
          View all notifications
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WhatsNew;
