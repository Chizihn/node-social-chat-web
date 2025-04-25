import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { suggestedFriends } from "@/data";
import FriendSuggestion from "../friend/FriendSuggestion";
import { Button } from "../ui/button";
import Link from "next/link";

const FriendSuggestionComp = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Find Friends</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="suggestions">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
            <TabsTrigger value="requests">
              Requests
              <span className="ml-1 bg-primary text-primary-foreground rounded-full h-4 w-4 text-xs flex items-center justify-center">
                2
              </span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="suggestions" className="p-2">
            <div className="space-y-1">
              {suggestedFriends.slice(0, 3).map((friend) => (
                <FriendSuggestion key={friend.id} user={friend} />
              ))}
            </div>
            <div className="p-3 text-center">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/friends">See all suggestions</Link>
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="requests" className="p-2 space-y-1">
            <div className="p-3 border border-border rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/images/user.webp" alt="User" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium text-sm">Sam Wilson</h4>
                  <p className="text-xs text-muted-foreground">
                    3 mutual friends
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                  ✓
                </Button>
                <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                  ✕
                </Button>
              </div>
            </div>
            <div className="p-3 border border-border rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/images/user.webp" alt="User" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium text-sm">Robin Hayes</h4>
                  <p className="text-xs text-muted-foreground">
                    1 mutual friend
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                  ✓
                </Button>
                <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                  ✕
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default FriendSuggestionComp;
