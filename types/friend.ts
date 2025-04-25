import { User } from "./user";

export enum FriendShipStatus {
  ACCEPTED = "ACCEPTED",
  PENDING = "PENDING",
  REJECTED = "REJECTED",
  BLOCKED = "BLOCKED",
}
export interface Friend {
  readonly id: string;
  requester: User;
  recipient: User;
  status: FriendShipStatus;
  mutualFriends: number;
  readonly createdAt: Date | null;
}

export type Friends = Friend[];

export interface Follow {
  follower: User;
  following: User;
}
