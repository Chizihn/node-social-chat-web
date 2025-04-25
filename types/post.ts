import { User } from "./user";

export interface Post {
  readonly id: string;
  content: string;
  user: User;
  likes: number;
  comments: number;
  shares: number;
  tags: string[];
  media: string[];
  location: string;
  isVerified: boolean;
  readonly createdAt: Date;
  updatedAt: Date;
}

export type Posts = Post[];

//Selecting fileds needed for the createpost interface from the Post interface
export type ExludeFieldForCreate = "content" | "tags" | "media" | "location";

//Create post type
export type CreatePost = Pick<Post, ExludeFieldForCreate>;

export interface CommentContent {
  text?: string;
  media?: string[];
  emoji?: string;
}

export interface Comment {
  readonly id: string;
  content: string;
  post: Post;
  user: User;
  likes: number;
  parentComment?: Comment;
  readonly createdAt: Date;
  updatedAt: Date;
}

export type Comments = Comment[];

export type CreateComment = Pick<Comment, "content" | "parentComment">;

export interface Like {
  readonly id: string;
  user: User;
  post?: Post;
  comment?: Comment;
}
