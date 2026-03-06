import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const doctorSchema = z.object({
  img: z
    .instanceof(File, { message: "Profile image is required" })
    .refine((f) => f.size > 0, "Profile image is required")
    .refine((f) => f.size <= MAX_FILE_SIZE, "Max file size is 5MB")
    .refine(
      (f) => ACCEPTED_IMAGE_TYPES.includes(f.type),
      "Only JPEG, PNG, and WebP are allowed"
    ),
  doctorIdCard: z
    .instanceof(File, { message: "ID card image is required" })
    .refine((f) => f.size > 0, "ID card image is required")
    .refine((f) => f.size <= MAX_FILE_SIZE, "Max file size is 5MB")
    .refine(
      (f) => ACCEPTED_IMAGE_TYPES.includes(f.type),
      "Only JPEG, PNG, and WebP are allowed"
    ),
  specialization: z.string().min(1, "Specialization is required"),
  experience: z.coerce.number().min(0, "Experience must be 0 or more"),
  qualification: z.string().min(1, "Qualification is required"),
  bio: z.string().min(1, "Bio is required"),
  clinicName: z.string().min(1, "Clinic name is required"),
  clinicAddress: z.string().min(1, "Clinic address is required"),
  clinicLocation: z.string().min(1, "Clinic location is required"),
  consultationFee: z.coerce.number().min(0, "Consultation fee must be 0 or more"),
  availableDays: z
    .array(z.string())
    .min(1, "Select at least one available day"),
  availableTime: z.object({
    start: z.string().min(1, "Start time is required"),
    end: z.string().min(1, "End time is required"),
  }),
});
