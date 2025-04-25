"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MoreHorizontal } from "lucide-react";
import { stories } from "@/data";
import Story from "@/components/feed/Story";
import CreatePost from "@/components/feed/CreatePost";
import PostView from "@/components/feed/PostView";
import { usePosts } from "@/lib/queries/usePost";
import { useAuthStore } from "@/store/useAuthStore";

export default function FeedPage() {
  const [activeTab, setActiveTab] = useState<string>("timeline");

  const {
    posts,
    isLoading,
    error,
    refetch,
    currentPage,
    totalPages,
    handlePageChange,
  } = usePosts();

  const user = useAuthStore((state) => state.user);

  return (
    <div className="py-6">
      {/* Stories row */}
      <div className="overflow-x-auto pb-2 -mx-1 px-1">
        <div className="flex gap-3 min-w-max px-1">
          {stories.map((story, index) => (
            <Story key={index} user={story} isActive={story.isActive} />
          ))}
        </div>
      </div>

      {/* Create post */}
      <CreatePost
        onPostCreated={refetch}
        userAvatar={user?.avatar || "/images/user.webp"}
        userName={user?.username || "User"}
      />

      {/* Feed tabs */}
      <Tabs defaultValue="timeline" className="w-full">
        <div className="flex justify-between items-center mb-2 px-4">
          <TabsList className="w-auto">
            <TabsTrigger
              value="timeline"
              onClick={() => setActiveTab("timeline")}
              className={
                activeTab === "timeline" ? "border-b-2 border-primary" : ""
              }
            >
              Timeline
            </TabsTrigger>

            <TabsTrigger
              value="foryou"
              onClick={() => setActiveTab("foryou")}
              className={
                activeTab === "foryou" ? "border-b-2 border-primary" : ""
              }
            >
              For you
            </TabsTrigger>

            <TabsTrigger
              value="popular"
              onClick={() => setActiveTab("popular")}
              className={
                activeTab === "popular" ? "border-b-2 border-primary" : ""
              }
            >
              Popular
            </TabsTrigger>
          </TabsList>

          <Button
            variant="ghost"
            size="sm"
            className="text-xs flex items-center gap-1"
          >
            <MoreHorizontal className="h-3 w-3" /> Filter
          </Button>
        </div>

        {/* Timeline Tab Content */}
        <TabsContent value="timeline" className="space-y-4 mt-0">
          {isLoading ? (
            <p className="text-muted-foreground px-4">Loading posts...</p>
          ) : error ? (
            <p className="text-destructive px-4">
              {" "}
              {error.message || "Failed to load posts."}{" "}
            </p>
          ) : posts.length === 0 ? (
            <div className="flex justify-center items-center pt-8">
              <p className="text-muted-foreground px-4">No posts to show.</p>
            </div>
          ) : (
            <>
              {posts.map((post) => (
                <PostView key={post.id} post={post} />
              ))}

              {currentPage < totalPages && (
                <div className="text-center pt-4">
                  <Button onClick={() => handlePageChange(currentPage + 1)}>
                    Load More
                  </Button>
                </div>
              )}
            </>
          )}
        </TabsContent>

        {/* Popular Tab (Not implemented) */}
        <TabsContent value="foryou" className="mt-0">
          <div className="py-8 text-center">
            <p className="text-muted-foreground">
              Posts for you currently unavailable.
            </p>
          </div>
        </TabsContent>

        {/* Popular Tab (Not implemented) */}
        <TabsContent value="popular" className="mt-0">
          <div className="py-8 text-center">
            <p className="text-muted-foreground">
              Popular content is currently unavailable.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
