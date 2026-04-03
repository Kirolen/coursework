import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(2, "name must contain at least 2 characters"),
  email: z.string().trim().email("invalid email"),
  password: z.string().min(6, "password must contain at least 6 characters"),
});

export const loginSchema = z.object({
  email: z.string().trim().email("invalid email"),
  password: z.string().min(1, "password is required"),
});

export type RegisterDto = z.infer<typeof registerSchema>;
export type LoginDto = z.infer<typeof loginSchema>;