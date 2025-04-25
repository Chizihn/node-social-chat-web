import z from "zod";

// Define the Signup schema
export const SignupData = z.object({
  username: z.string().min(3).max(20),
  email: z.string().email(),
  password: z.string().min(8),
});

// Define the Signin schema
export const SigninData = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const VerifyEmailData = z.object({
  otp: z.string().max(6),
});

export const ResetPasswordData = z.object({
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
});

// Using z.infer to extract the TypeScript types
export type SignupType = z.infer<typeof SignupData>;
export type SigninType = z.infer<typeof SigninData>;
export type VerifyEmailType = z.infer<typeof VerifyEmailData>;
export type ResetPasswordType = z.infer<typeof ResetPasswordData>;
