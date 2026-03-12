import Doctor from "../../database/models/doctor.schema.js";
import { generateEmbedding, doctorToText } from "./embeddingService.js";

// Single doctor sync
export async function syncDoctorEmbedding(doctorId) {
  try {
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return;

    const text = doctorToText(doctor);
    const embedding = await generateEmbedding(text);

    await Doctor.findByIdAndUpdate(doctorId, { embedding });
    console.log(`✅ Embedding synced: ${doctor.clinicName}`);
  } catch (err) {
    console.error(`❌ Sync failed for ${doctorId}:`, err.message);
  }
}

// Saare verified doctors sync karo (first time setup)
export async function syncAllDoctors() {
  const doctors = await Doctor.find({ isVerified: true });
  console.log(`🔄 Syncing ${doctors.length} doctors...`);

  for (const doctor of doctors) {
    await syncDoctorEmbedding(doctor._id);
    await new Promise(r => setTimeout(r, 300)); // rate limit se bachao
  }

  console.log("✅ All doctors synced!");
}