import { GoogleGenerativeAI } from "@google/generative-ai";
import Doctor from "../../database/models/doctor.schema.js";
import { generateEmbedding } from "../services/embeddingService.js";
import { syncAllDoctors } from "../services/vectorSyncService.js";

const genAI = new GoogleGenerativeAI(process.env.ai_api);

async function findRelevantDoctors(queryEmbedding) {
  return await Doctor.aggregate([
    {
      $vectorSearch: {
        index: "doctor_vector_index",
        path: "embedding",
        queryVector: queryEmbedding,
        numCandidates: 20,
        limit: 3,
        filter: { isVerified: true },
      },
    },
    {
      $project: {
        specialization: 1,
        qualification: 1,
        experience: 1,
        consultationFee: 1,
        clinicName: 1,
        clinicLocation: 1,
        availableDays: 1,
        availableTime: 1,
        slug: 1,
        userEmail: 1,
        score: { $meta: "vectorSearchScore" },
      },
    },
  ]);
}

export async function chat(req, res) {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Message required" });

    // Step 1: Query embedding
    const queryEmbedding = await generateEmbedding(message);

    // Step 2: Relevant doctors
    let relevantDoctors = [];
    try {
      relevantDoctors = await findRelevantDoctors(queryEmbedding);
    } catch (e) {
      console.warn("Vector search failed:", e.message);
    }

    // Step 3: Context string
    const doctorContext =
      relevantDoctors.length > 0
        ? relevantDoctors
          .map(
            (d) =>
              `- ${d.specialization} | ${d.qualification} | ${d.experience} yrs | ` +
              `Fee: ₹${d.consultationFee} | ${d.clinicName}, ${d.clinicLocation} | ` +
              `Days: ${d.availableDays?.join(", ")} | ` +
              `Profile: /doctors/${d.slug}`
          )
          .join("\n")
        : "No specific doctors found.";

    // Step 4: Gemini call
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    const prompt = `
You are Dr. MedTechBot — a friendly medical assistant on MedTech platform.

Relevant Doctors on Platform:
${doctorContext}

Rules:
- General medical guidance only, no diagnosis or prescriptions
- Recommend matching doctors from above list with their name if available
- Always mention the profile link as: https://medtech.garvitsinghal.in/doctors/[slug]
- Keep response under 150 words
- Be empathetic and professional

User: ${message}
Dr. MedTechBot:`;

    const result = await model.generateContent(prompt);

    res.json({
      success: true,
      message: result.response.text(),
      suggestedDoctors: relevantDoctors,
    });
  } catch (err) {
    console.error("AI chat error:", err);
    res.status(500).json({ error: "AI service error" });
  }
}

export async function syncDoctors(req, res) {
  try {
    syncAllDoctors(); // background mein chalao
    res.json({ success: true, message: "Sync started in background" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}