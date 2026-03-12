import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.ai_api});

export async function generateEmbedding(text) {
  const response = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: text,
  });
  return response.embeddings[0].values; // 3072 numbers
}

export function doctorToText(doctor) {
  const days = doctor.availableDays?.join(", ") || "Not specified";
  const time = doctor.availableTime
    ? `${doctor.availableTime.start} - ${doctor.availableTime.end}`
    : "Not specified";

  return `
    Specialization: ${doctor.specialization}
    Qualification: ${doctor.qualification}
    Experience: ${doctor.experience} years
    Bio: ${doctor.bio}
    Clinic: ${doctor.clinicName}
    Location: ${doctor.clinicLocation}, ${doctor.clinicAddress}
    Consultation Fee: ${doctor.consultationFee}
    Available Days: ${days}
    Available Time: ${time}
  `.trim();
}