import { User } from "./user";

export enum NotificationType {
  NEW_FOLLOWER = "new_follower",
  FRIEND_REQUEST = "friend_request",
  FRIEND_ACCEPT = "friend_accept",
  NEW_MESSAGE = "new_message",
  POST_LIKE = "post_like",
  POST_COMMENT = "post_comment",
  MENTION = "mention",
}

export interface Notification {
  id: string;
  recipient: string;
  sender: Partial<User>;
  type: NotificationType;
  read: boolean;
  content: string;
  entityId?: string;
  entityModel?: string;
  createdAt: string;
  updatedAt: string;
}

export type Notifications = Notification[];

export interface NotificationResponse {
  notifications: Notifications;
  unreadCount: number;
}
