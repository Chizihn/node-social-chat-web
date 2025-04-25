import { FriendRequestType, UserType } from "@/types";

export const stories = [
  { name: "Your Story", avatar: "/images/user.webp", isActive: false },
  { name: "Alex Johnson", avatar: "/images/user.webp", isActive: true },
  { name: "Jamie Smith", avatar: "/images/user.webp", isActive: true },
  { name: "Taylor Wilson", avatar: "/images/user.webp", isActive: true },
  { name: "Jordan Lee", avatar: "/images/user.webp", isActive: true },
];

export const posts = [
  {
    id: 1,
    content:
      "Just launched our new product! Check it out and let me know what you think. #ProductLaunch #Exciting",
    date: "2h ago",
    likes: 45,
    comments: 12,
    reposts: 8,
    media: "/images/user.webp",
  },
  {
    id: 2,
    content:
      "Great meetup with fellow developers today. Always inspiring to connect with the community! #TechTalk #Networking",
    date: "1d ago",
    likes: 76,
    comments: 23,
    reposts: 14,
  },
  {
    id: 3,
    content:
      "Working on something exciting. Can't wait to share more details soon!",
    date: "3d ago",
    likes: 120,
    comments: 32,
    reposts: 18,
  },
];

export const suggestedPeople = [
  { id: 1, name: "Riley Morgan", mutualCount: 4 },
  { id: 2, name: "Avery Taylor", mutualCount: 2 },
  { id: 3, name: "Quinn Zhang", mutualCount: 3 },
  { id: 4, name: "Drew Parker", mutualCount: 1 },
];

// Sample data
export const suggestedFriends: UserType[] = [
  {
    id: 1,
    name: "Alex Johnson",
    avatar: "/images/user.webp",
    mutualFriends: 5,
    bio: "Photographer and travel enthusiast. Love to explore new places!",
    location: "New York, NY",
    interests: ["Photography", "Travel", "Food"],
  },
  {
    id: 2,
    name: "Jamie Smith",
    avatar: "/images/user.webp",
    mutualFriends: 3,
    bio: "Software engineer by day, musician by night.",
    location: "San Francisco, CA",
    interests: ["Music", "Coding", "Coffee"],
  },
  {
    id: 3,
    name: "Taylor Wilson",
    avatar: "/images/user.webp",
    mutualFriends: 2,
    bio: "Fitness coach and nutrition specialist.",
    location: "Austin, TX",
    interests: ["Fitness", "Nutrition", "Outdoors"],
  },
  {
    id: 4,
    name: "Jordan Lee",
    avatar: "/images/user.webp",
    mutualFriends: 7,
    bio: "Book lover and aspiring writer. Always looking for recommendations!",
    location: "Seattle, WA",
    interests: ["Books", "Writing", "Art"],
  },
  {
    id: 5,
    name: "Casey Brown",
    avatar: "/images/user.webp",
    mutualFriends: 1,
    bio: "Graphic designer with a passion for minimalist design.",
    location: "Portland, OR",
    interests: ["Design", "Art", "Hiking"],
  },
  {
    id: 6,
    name: "Riley Garcia",
    avatar: "/images/user.webp",
    mutualFriends: 4,
    bio: "Chef and food blogger. I create recipes with local ingredients.",
    location: "Chicago, IL",
    interests: ["Cooking", "Blogging", "Local Food"],
  },
];

export const friendRequests: FriendRequestType[] = [
  {
    id: 101,
    name: "Morgan Taylor",
    avatar: "/images/user.webp",
    mutualFriends: 3,
    timeAgo: "2 days ago",
  },
  {
    id: 102,
    name: "Sam Rodriguez",
    avatar: "/images/user.webp",
    mutualFriends: 5,
    timeAgo: "1 week ago",
  },
  {
    id: 103,
    name: "Drew Williams",
    avatar: "/images/user.webp",
    mutualFriends: 2,
    timeAgo: "3 weeks ago",
  },
];
