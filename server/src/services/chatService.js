import mongoose from "mongoose";
import User from "../../database/models/user.schema.js";
import {GoogleGenerativeAI} from "@google/generative-ai";

const generateResponse = async (query) => {
  const apiKey = process.env.ai_api;
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({model: "gemini-2.0-flash"});
  const systemPrompt = `
      You are Dr. MedTechBot developed by Garvit & team — a friendly and professional **medical advisor**.
      Respond as a certified doctor who gives evidence-based, empathetic answers.
      Keep responses **under 100 words** unless a detailed explanation is clearly necessary.
      Avoid providing diagnoses or prescriptions — give **general medical guidance** only.
      Dont give advice other than medical field.
    `;
  const prompt = `${systemPrompt}\n\nUser: ${query}\nDoctor:`;
  try {
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    return response;
  } catch (err) {
    throw new Error("SomeThing Went Wrong!!");
  }
};

export default {
  generateResponse,
};
