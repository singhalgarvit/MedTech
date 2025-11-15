import {z} from "zod";

export const doctorSchema = z.object({
  img: z.url("Invalid image URL").min(1, "Image is required"),
  specialization: z.string().min(1, "Specialization is required"),
  experience: z.number().min(0, "Experience must be a positive number"),
  qualification: z.string().min(1, "Qualification is required"),
  bio: z.string().min(1, "Bio is required"),
  clinicName: z.string().min(1, "Clinic name is required"),
  clinicAddress: z.string().min(1, "Clinic address is required"),
  clinicLocation: z.string().min(1, "Clinic location is required"),
  consultationFee: z.number().min(0, "Consultation fee must be positive"),
  availableDays: z.array(z.string()).nonempty("Available days are required"),
  availableTime: z.object({
    start: z.string().min(1, "Start time is required"),
    end: z.string().min(1, "End time is required"),
  }),
  isVerified: z.boolean().default(false),
  doctorIdCard: z
    .url("Invalid ID card URL")
    .min(1, "Doctor ID card is required"),
});
