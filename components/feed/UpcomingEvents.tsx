import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";

const UpcomingEvents = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Upcoming Events</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="bg-accent/20 rounded-lg p-3">
            <div className="flex gap-3">
              <div className="bg-primary/10 text-primary rounded-lg h-12 w-12 flex flex-col items-center justify-center text-center">
                <span className="text-xs font-bold">APR</span>
                <span className="text-lg font-bold">15</span>
              </div>
              <div>
                <h4 className="font-medium text-sm">Tech Meetup 2025</h4>
                <p className="text-xs text-muted-foreground">
                  San Francisco, CA
                </p>
                <div className="flex items-center mt-1">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <Avatar
                        key={i}
                        className="h-5 w-5 border border-background"
                      >
                        <AvatarImage src={`/images/user.webp`} />
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                  <span className="text-xs ml-1">+12 going</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="ghost" className="w-full text-sm" size="sm">
          Explore all events
        </Button>
      </CardFooter>
    </Card>
  );
};

export default UpcomingEvents;
