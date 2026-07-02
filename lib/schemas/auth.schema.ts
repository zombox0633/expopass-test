import { z } from "zod";

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .regex(/[a-zA-Z]/, "Password must contain at least one letter.")
  .regex(/[0-9]/, "Password must contain at least one number.")
  .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character (e.g. !@#$%).");

// sign-up: บังคับกติการหัสผ่านเต็มรูปแบบ
export const signUpSchema = z.object({
  email: z.email("Invalid email address."),
  password: passwordSchema,
});

// sign-in: แค่มีค่าพอ — กติกาความแข็งแรงเช็คตอนสมัครไปแล้ว
export const signInSchema = z.object({
  email: z.email("Invalid email address."),
  password: z.string().min(1, "Password is required."),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
