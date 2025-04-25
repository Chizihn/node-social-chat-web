// Types
export type UserType = {
  id: number;
  name: string;
  avatar: string;
  mutualFriends: number;
  bio?: string;
  location?: string;
  interests?: string[];
};

export interface PostType {
  id: string;
  content: string;
  likes: number;
  comments: number;
  shares?: number;
  timestamp: string;
  tags?: string[];
  media?: string;
  location?: string;
  isVerified?: boolean;
  user: {
    name: string;
    username?: string;
    avatar: string;
  };
}

export interface FriendRequestType {
  id: number;
  name: string;
  avatar: string;
  mutualFriends: number;
  timeAgo: string;
}
