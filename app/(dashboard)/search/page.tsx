"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { Input } from "@/components/ui/input";
import { useSearch } from "@/lib/queries/useSearch";
import { Separator } from "@/components/ui/separator";
import FindFriendList from "@/components/friend/FindFriendList";
import { Users } from "@/types/user";

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery);

  const {
    searchResults,
    isLoading: allUsersLoading,
    error: allUsersError,
  } = useSearch(debouncedSearchQuery);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">
            Search
          </h1>
          <p className="text-muted-foreground text-lg">
            Search for people and content across the platform
          </p>
          <Separator className="mt-4" />
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search for people..."
            className="pl-10 py-6 rounded-full bg-muted/50 border-none focus-visible:ring-primary focus-visible:ring-offset-2"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {searchQuery && (
          <div className="bg-muted/30 py-2 px-4 rounded-full inline-block mb-6">
            <p className="text-sm text-muted-foreground">
              Found {searchResults?.length} results for &quot;{searchQuery}
              &quot;
            </p>
          </div>
        )}

        <div className="space-y-6">
          <FindFriendList
            friends={searchResults as Users}
            loading={allUsersLoading}
            error={allUsersError?.message as string}
            type="search"
            hasSearched={!!debouncedSearchQuery}
          />
        </div>
      </div>
    </div>
  );
}
