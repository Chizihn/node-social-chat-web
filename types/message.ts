// import { User } from "./user";

import { User } from "./user";

// export interface Conversation {
//   id: string;
//   recipient: Partial<User> | null;
//   lastMessage: string;
//   timestamp: Date;
//   updatedAt: Date;
//   unread: number;
//   online: boolean;
// }

// export interface Attachment {
//   name: string;
//   type: string;
//   url: string;
// }

// export enum MessageStatus {
//   SENDING = "SENDING",
//   SENT = "SENT",
//   DELIVERED = "DELIVERED",
//   READ = "READ",
// }

// export interface Message {
//   id: string;
//   senderId: string;
//   text: string;
//   timestamp: Date;
//   createdAt?: Date;
//   status: MessageStatus;
//   attachments?: Attachment[];
// }

// Match the backend MessageStatus enum

// export enum MessageStatus {
//   SENT = "SENT",
//   DELIVERED = "DELIVERED",
//   READ = "READ",
// }

// export interface Attachment {
//   name: string;
//   type: string;
//   url: string;
// }

// export interface Message {
//   _id: string;
//   conversation: string;
//   sender: string;
//   text: string;
//   status: MessageStatus;
//   attachments?: Attachment[];
//   createdAt: string;
//   updatedAt: string;
// }

// export interface Conversation {
//   _id: string;
//   participants: string[];
//   lastMessage: string | null;
//   createdAt: string;
//   updatedAt: string;
// }

// // For the frontend display
// export interface ConversationDisplay {
//   id: string;
//   name: string;
//   avatar: string;
//   online: boolean;
//   lastSeen?: Date;
//   messages: Message[];
//   unread?: number;
// }

export enum MessageStatus {
  SENDING = "SENDING",
  SENT = "SENT",
  DELIVERED = "DELIVERED",
  READ = "READ",
  ERROR = "ERROR", // Added to handle error states
}

export interface Attachment {
  name: string;
  type: string;
  url: string;
}

export interface Message {
  id: string;
  conversation: string;
  sender: Partial<User>;
  text: string;
  status: MessageStatus;
  attachments?: string[];
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Conversation {
  id: string;
  recipient: Partial<User>;
  lastMessage: string | null;
  timestamp: Date;
  createdAt: string;
  updatedAt: string;
}

// Enhanced for consistent display across components
export interface ConversationDisplay {
  id: string;
  name: string;
  avatar: string;
  online?: boolean;
  lastSeen?: string;
  messages: Message[];
  unread?: number;
  recipient?: Partial<User>;
}
