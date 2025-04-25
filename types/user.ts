export enum Gender {
  MALE = "Male",
  FEMALE = "Female",
  OTHER = "Other",
}

export interface User {
  readonly id: string;
  username: string;
  email: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  gender?: Gender | null;
  dateOfBirth?: string;
  location?: string;
  hobbies?: string[];
  interests?: string[];
  avatar?: string;
  coverImage?: string;
  bio?: string;
  isPrivate?: boolean;
  isVerified: boolean;
  followers: string[];
  following: string[];
  readonly createdAt: Date | null;
  readonly updatedAt?: Date;
}

export type Users = User[];
