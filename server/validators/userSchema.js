import { z } from "zod";

export const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  img: z.string().optional(),
  role: z.enum(["patient", "doctor", "admin"]).default("patient"),

  doctorDetails: z
    .object({
      specialization: z.string().optional(),
      experience: z.number().optional(),
      qualification: z.string().optional(),
      bio: z.string().optional(),
      clinicName: z.string().optional(),
      clinicAddress: z.string().optional(),
      clinicLocation: z.string().optional(),
      consultationFee: z.number().optional(),
      availableDays: z.array(z.string()).optional(),
      availableTime: z
        .object({
          start: z.string().optional(),
          end: z.string().optional(),
        })
        .optional(),
    })
    .optional(),

  medicalHistory: z
    .array(
      z.object({
        illness: z.string().optional(),
        treatment: z.string().optional(),
        date: z.string().optional(),
      })
    )
    .optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});
