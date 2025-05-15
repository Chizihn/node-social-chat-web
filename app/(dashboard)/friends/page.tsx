"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Search, Filter } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import FriendRequestList from "@/components/friend/FriendRequestList";
import {
  useFindFriends,
  useFriendRequests,
  useFriends,
} from "@/lib/queries/useFriends";
import FriendList from "@/components/friend/FriendList";
import { Friends } from "@/types/friend";
import FindFriendList from "@/components/friend/FindFriendList";
import { User, Users } from "@/types/user";

// Import sources with icons
// const importSources = [
//   { name: "Gmail", icon: <Mail className="h-5 w-5" /> },
//   { name: "Facebook", icon: <Facebook className="h-5 w-5" /> },
//   { name: "Twitter", icon: <Twitter className="h-5 w-5" /> },
//   { name: "Phone Contacts", icon: <Smartphone className="h-5 w-5" /> },
// ];

// Main Friends Page Component
export default function FriendsPage() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState("my-friends");

  const { friends, friendsLoading, friendsError } = useFriends();
  const { friendRequests, isLoading, error } = useFriendRequests();
  const {
    friendSugestions,
    isLoading: findFriendsLoading,
    error: findFriendsError,
  } = useFindFriends();

  // Filter friends based on search query
  const filteredFriends = friends?.filter(
    (friend) =>
      friend.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      friend.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      friend.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter suggested friends based on search query
  const filteredSuggestions = friendSugestions?.filter(
    (user: User) =>
      user.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.bio &&
        user.bio.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.location &&
        user.location.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header would be here */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">
            Friends
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage your friends and discover new connections
          </p>
          <Separator className="mt-4" />
        </div>

        <Tabs
          defaultValue="my-friends"
          className="mb-6"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <div className="flex items-center justify-between mb-6">
            <TabsList className="grid w-full max-w-md grid-cols-4 p-1 bg-muted/50">
              <TabsTrigger
                value="my-friends"
                className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                My Friends
              </TabsTrigger>
              <TabsTrigger
                value="find-friends"
                className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Find Friends
              </TabsTrigger>
              <TabsTrigger
                value="requests"
                className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Requests
                {friendRequests && friendRequests?.length > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {friendRequests?.length}
                  </Badge>
                )}
              </TabsTrigger>
              {/* <TabsTrigger
                value="import"
                className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Import
              </TabsTrigger> */}
            </TabsList>
          </div>

          <div className="flex gap-4 items-center mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={
                  activeTab === "my-friends"
                    ? "Search your friends..."
                    : "Search for new friends..."
                }
                className="pl-10 py-6 rounded-full bg-muted/50 border-none focus-visible:ring-primary focus-visible:ring-offset-2"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-12 w-12"
            >
              <Filter className="h-5 w-5" />
            </Button>
          </div>

          {/* My Friends Tab */}
          <TabsContent value="my-friends" className="space-y-6">
            {searchQuery && (
              <div className="bg-muted/30 py-2 px-4 rounded-full inline-block">
                <p className="text-sm text-muted-foreground">
                  Found {friends?.length} results for &quot;{searchQuery}
                  &quot;
                </p>
              </div>
            )}

            <FriendList
              friends={filteredFriends as Users}
              loading={friendsLoading}
              error={friendsError?.message as string}
            />
          </TabsContent>

          {/* Find Friends Tab */}
          <TabsContent value="find-friends" className="space-y-6">
            {searchQuery && (
              <div className="bg-muted/30 py-2 px-4 rounded-full inline-block">
                <p className="text-sm text-muted-foreground">
                  Found {filteredFriends?.length} results for &quot;
                  {searchQuery}&quot;
                </p>
              </div>
            )}
            <FindFriendList
              friends={filteredSuggestions}
              loading={findFriendsLoading}
              error={findFriendsError?.message as string}
            />
          </TabsContent>

          {/* Friend Requests Tab */}
          <TabsContent value="requests">
            <FriendRequestList
              friendRequests={friendRequests as Friends}
              loading={isLoading}
              error={error?.message as string}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
