import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Fallback logic in case API key is missing is handled in the UI/Hook
export const generateMysticalFortune = async (): Promise<string> => {
  if (!apiKey) {
    throw new Error("API Key not found");
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: "Generate a single, short, surreal, and mystical fortune related to the ocean, sardines, or shiny objects. It should be weird but insightful. Max 20 words.",
      config: {
        temperature: 1.2, // High creativity
      }
    });

    return response.text.trim();
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};