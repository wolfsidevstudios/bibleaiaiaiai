
import { GoogleGenAI, Chat } from "@google/genai";
import { ChatMessage } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

let chat: Chat | null = null;

const getChat = () => {
    if(!chat) {
        chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: "You are a helpful and knowledgeable Bible study assistant. Your purpose is to help users understand the scriptures. Answer questions clearly and concisely, referencing Bible verses where appropriate. Maintain a respectful and reverent tone. All your knowledge should be based on the contents of the Holy Bible.",
            },
        });
    }
    return chat;
}

export const generateAiResponse = async (prompt: string): Promise<string> => {
  try {
    const chatInstance = getChat();
    const result = await chatInstance.sendMessage({ message: prompt });
    return result.text;
  } catch (error) {
    console.error("Error generating AI response:", error);
    return "I'm sorry, I encountered an error. Please try again.";
  }
};
