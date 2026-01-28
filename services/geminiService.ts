
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateSchoolAnnouncement = async (topic: string, tone: 'professional' | 'urgent' | 'friendly') => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a professional school announcement for a South African school about: ${topic}. 
      The tone should be ${tone}. 
      Include a clear Subject, a detailed Body, and a closing signature section.
      Mention that this is a NexLink automated communication.`,
      config: {
        temperature: 0.7,
        topP: 0.95,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Failed to generate content. Please try again manually.";
  }
};

export const analyzeAttendanceData = async (summary: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze this attendance data for a school: ${summary}. 
      Provide 3 key insights and 2 recommendations for the school principal. 
      Keep it concise and helpful for a South African school context.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            insights: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["insights", "recommendations"]
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Analysis Error:", error);
    return null;
  }
}

export const generateSmartReplies = async (conversation: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Context: A conversation between school staff and parents/students.
      Last messages: ${conversation}.
      Provide 3 short, professional, and helpful reply suggestions.
      Return them in a JSON array of strings.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    return ["Understood, thank you.", "I will check and get back to you.", "Thank you for the update."];
  }
};

export const generateEventDescription = async (title: string, category: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Create an engaging, professional event description for a school event titled "${title}" in the category "${category}". 
      Mention that parents should RSVP via the NexLink app. 
      Tailor it for a South African audience. Include key details like 'What to bring' and 'Arrival time' as placeholders.`,
      config: { temperature: 0.8 }
    });
    return response.text;
  } catch (error) {
    return "Event details coming soon. Please check back later.";
  }
};
