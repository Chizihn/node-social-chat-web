// components/UserMedia.tsx

import React from "react";
import Image from "next/image";
import { Posts } from "@/types/post";

type UserMediaProps = {
  posts: Posts;
};

const UserMedia: React.FC<UserMediaProps> = ({ posts }) => {
  const mediaPosts = posts.filter(
    (post) => post.media && post.media.length > 0
  );

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
      {mediaPosts.length > 0 ? (
        mediaPosts.map((post, index) => (
          <div
            key={index}
            className="relative aspect-square rounded-lg overflow-hidden bg-accent/20"
          >
            <Image
              src={post.media[0]}
              alt={`Media ${index + 1}`}
              fill
              className="object-cover"
            />
          </div>
        ))
      ) : (
        <div className="col-span-3 py-8 text-center text-muted-foreground">
          No media posts yet
        </div>
      )}
    </div>
  );
};

export default UserMedia;
