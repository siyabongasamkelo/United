import { z } from "zod";

export const StudentRegisterSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address format."),
    password: z.string().min(8, "Password must be at least 8 characters long."),
  }),
});

export const AdminCreateUserSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address format."),
    role: z.enum(["admin", "staff"]),
    staffNumber: z.string().optional(),
    nationalId: z.string().optional(),
  }),
});

export const CompleteSetupSchema = z.object({
  body: z.object({
    token: z.string().min(1, "Setup or confirmation token is required."),
    password: z.string().min(8, "Password must be at least 8 characters long."),
  }),
});

export const LoginSchema = z.object({
  body: z.object({
    identifier: z
      .string()
      .min(
        1,
        "Login identifier is required (Email, Staff ID, or National ID).",
      ),
    password: z.string().min(1, "Password field is required."),
  }),
});
