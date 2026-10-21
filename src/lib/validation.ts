import { z } from "zod";

export const registerSchema = z
  .object({
    fullName: z.string().trim().min(2, "Full name must be at least 2 characters").max(100, "Full name is too long"),
    email: z.string().trim().min(1, "Email is required").email("Enter a valid email address").max(255),
    password: z.string().min(6, "Password must be at least 6 characters").max(72, "Password is too long"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const loanSchema = z
  .object({
    borrowerId: z.string().uuid("Please choose a member"),
    bookTitle: z.string().trim().min(1, "Book title is required").max(200, "Book title is too long"),
    author: z.string().trim().min(1, "Author is required").max(200, "Author is too long"),
    borrowedAt: z.string().min(1, "Borrow date is required"),
    dueDate: z.string().min(1, "Due date is required"),
    notes: z.string().trim().max(1000, "Notes are too long"),
  })
  .refine((d) => !d.borrowedAt || !d.dueDate || d.dueDate >= d.borrowedAt, {
    message: "Due date cannot be before the borrow date",
    path: ["dueDate"],
  });

export function fieldErrors<T>(error: z.ZodError<T>): Partial<Record<keyof T & string, string>> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0]);
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
