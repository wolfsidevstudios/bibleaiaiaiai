import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";
import { ChatMessage, Plan } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const planSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "A creative and relevant title for the Bible plan." },
    duration: { type: Type.STRING, description: "The length of the plan, e.g., '7-Day Plan'." },
    description: { type: Type.STRING, description: "A short, engaging summary of what the plan is about." },
    content: {
      type: Type.ARRAY,
      description: "The daily content for the plan.",
      items: {
        type: Type.OBJECT,
        properties: {
          day: { type: Type.INTEGER, description: "The day number of the reading." },
          title: { type: Type.STRING, description: "The title for this specific day's reading." },
          scripture: { type: Type.STRING, description: "The main Bible reference for the day (e.g., 'John 14:27')." },
          body: { type: Type.STRING, description: "A devotional text explaining the scripture and theme for the day." },
          prayer: { type: Type.STRING, description: "A short prayer related to the day's topic." },
        },
        required: ["day", "title", "scripture", "body", "prayer"],
      },
    },
  },
  required: ["title", "duration", "description", "content"],
};

// Fix: Use a function declaration for creating Bible plans. This allows the model to choose between generating a plan or a text response.
const createBiblePlanDeclaration: FunctionDeclaration = {
  name: "create_bible_plan",
  description: "Creates a structured Bible reading plan based on a theme, topic, or book of the Bible.",
  parameters: planSchema,
};


export const generateAiResponse = async (prompt: string): Promise<string | Plan> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        // Fix: Update system instruction to direct the model to use the declared function for plan requests.
        systemInstruction: "You are Lexi, a helpful Bible study assistant. Your purpose is to help users understand the scriptures. Answer questions clearly and concisely. If the user asks for a Bible plan, reading plan, or devotional, you MUST call the `create_bible_plan` function with the generated plan. For all other questions, respond with a helpful text answer.",
        // Fix: Use `tools` instead of forcing a `responseSchema` on every request.
        tools: [{ functionDeclarations: [createBiblePlanDeclaration] }],
      },
    });

    const functionCalls = response.functionCalls;

    // Fix: Check for a function call in the response to determine if a plan should be created.
    if (functionCalls && functionCalls.length > 0) {
      const planData = functionCalls[0].args;
      // Basic validation to ensure we have a plan-like object
      if (planData && planData.title && planData.content && Array.isArray(planData.content)) {
        return { ...(planData as Omit<Plan, 'id'>), id: `user-plan-${Date.now()}` };
      }
    }

    // If no valid function call, return the text response from the model.
    return response.text;

  } catch (error) {
    console.error("Error generating AI response:", error);
    // Fix: Simplify error handling as the robust function calling approach removes the need for a complex fallback request.
    return "I'm sorry, I encountered an error. Please try again.";
  }
};

export const generateDailyPrayer = async (): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: 'Write a short, encouraging, and personal morning prayer for a user of a Bible app. Make it about 2-3 sentences long.',
       config: {
          systemInstruction: "You are a thoughtful spiritual guide writing a prayer.",
      },
    });
    return response.text;
  } catch (error) {
    console.error("Error generating daily prayer:", error);
    return "Lord, thank you for this new day. Guide my steps and fill my heart with your peace. Amen."; // Fallback prayer
  }
};