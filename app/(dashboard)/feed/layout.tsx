"use client";

import { ReactNode } from "react";
import WhatsNew from "@/components/feed/WhatsNew";
// import FriendSuggestionComp from "@/components/feed/FriendSuggestion";
// import UpcomingEvents from "@/components/feed/UpcomingEvents";
// import PeopleYouMayKnow from "@/components/feed/PeopleYouMayKnow";
// import TrendingTopics from "@/components/feed/TrendingTopics";

interface FeedLayoutProps {
  children: ReactNode;
}

export default function FeedLayout({ children }: FeedLayoutProps) {
  return (
    <div className="w-full h-full flex">
      {/* Main feed column */}
      <div className="w-full h-full pr-4 overflow-y-auto">{children}</div>

      {/* Right sidebar */}
      <div className="hidden lg:block w-[35rem] pl-4 h-full overflow-y-auto">
        <div className="py-6 space-y-4">
          <WhatsNew />
          {/* <FriendSuggestionComp /> */}
          {/* <UpcomingEvents /> */}
          {/* <PeopleYouMayKnow /> */}
          {/* <TrendingTopics /> */}
        </div>
      </div>
    </div>
  );
}
