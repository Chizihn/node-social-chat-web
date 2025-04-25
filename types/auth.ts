import { User } from "./user";

export interface SigninResponse {
  user: User;
  token: string;
}

export interface SignupResponse {
  user: User;
  token: string;
}
