import { z } from "zod";

export const signUpSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 3 chars long" })
    .max(50, { message: "Name cannot exceed 50 chararcters long" }),
  email: z
    .string()
    .email({ message: "Please enter a valid email" })
    .min(2, { message: "Email must be at least 3 chars long" })
    .max(50, { message: "Email cannot exceed 50 chararcters long" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 chars long" })
    .max(50, { message: "Password cannot exceed 50 chararcters long" }),
});

export const signInSchema = z.object({
  email: z
    .string()
    .email({ message: "Please enter a valid email" })
    .min(2, { message: "Email must be at least 3 chars long" })
    .max(50, { message: "Email cannot exceed 50 chararcters long" }),
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .max(50, { message: "Password cannot exceed 50 chararcters long" }),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email" }),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 chars long" })
      .max(50, { message: "Password cannot exceed 50 chararcters long" }),
    confirmPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 chars long" })
      .max(50, { message: "Password cannot exceed 50 chararcters long" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
