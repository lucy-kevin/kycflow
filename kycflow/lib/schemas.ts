import { z } from "zod"

export const submissionSchema = z.object({
  customerName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name must only contain letters and spaces")
    .refine((val) => val.trim().split(/\s+/).length >= 2, {
      message: "Please enter your full name (first and last name)",
    }),

  dateOfBirth: z
    .string()
    .min(1, "Date of birth is required")
    .refine((val) => {
      const date = new Date(val)
      const today = new Date()
      const age = today.getFullYear() - date.getFullYear()
      const monthDiff = today.getMonth() - date.getMonth()
      const dayDiff = today.getDate() - date.getDate()
      const exactAge =
        monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)
          ? age - 1
          : age
      return exactAge >= 18
    }, "You must be at least 18 years old"),

  nationality: z
    .string()
    .min(2, "Nationality is required"),

  email: z
    .string()
    .email("Please enter a valid email address"),

  idType: z.enum(["National ID", "Passport", "Driving Licence"], {
    message: "Please select a valid ID type",
  }),
})

export type SubmissionFormData = z.infer<typeof submissionSchema>