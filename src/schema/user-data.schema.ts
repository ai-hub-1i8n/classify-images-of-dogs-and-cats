import { z } from "zod";

export const FormSchema = z.object({
  name: z.string({
    error: "Name is required",
  }),
  lastName: z.string({
    error: "Last name is required",
  }),
  email: z
    .string({
      error: "Email is required",
    })
    .email(),
  role: z
    .enum(["admin", "editor", "viewer", "guest"], {
      error: "Role is required",
    })
    .default("viewer"),
  status: z
    .enum(["active", "inactive"], {
      error: "Status is required",
    })
    .default("active"),
  password: z
    .string({
      error: "Password is required",
    })
    .min(6, "Password must be at least 6 characters long"),
  image: z.file().refine((file) => file.size > 0, "Image is required"),
  bio: z
    .string()
    .max(200, "Bio must be at most 200 characters long")
    .optional(),
  website: z.string().url("Website must be a valid URL").optional(),
});
