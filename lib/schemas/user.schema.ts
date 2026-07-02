import { z } from "zod";

// ตรวจ UserData ก่อนส่งไปบันทึก (ใช้ในฟอร์ม Edit)
export const userDataSchema = z.object({
  email: z.email("Invalid email address."),
  password: z.string().optional(),
  first_name: z
    .string()
    .min(1, "First name is required.")
    .regex(/^[^0-9]+$/, "First name cannot contain numbers."),
  last_name: z
    .string()
    .min(1, "Last name is required.")
    .regex(/^[^0-9]+$/, "Last name cannot contain numbers."),
  gender: z.number().int().optional(),
  age: z.number().int().optional(),
});
