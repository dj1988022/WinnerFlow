
import { GoogleGenAI } from "@google/genai";

// Initialize Gemini AI
// Note: In a production app, API calls should go through a backend to protect the key.
// For this MVP demo, we use the key injected by Vite.
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const analyzeAdImage = async (base64Image: string) => {
  try {
    const model = "gemini-2.5-flash-latest";
    const prompt = `
      You are an expert viral marketing analyst. Analyze this ad creative (image/frame) and decode its success formula.
      
      Return a JSON object with the following structure:
      {
        "hookType": "Visual Shock" | "Problem Agitation" | "Curiosity Gap" | "Direct Offer" | "Social Proof",
        "hookScore": number (0-100),
        "visualElements": ["element1", "element2"],
        "emotionalTriggers": ["emotion1", "emotion2"],
        "copywritingAnalysis": "Brief analysis of text overlay or visual storytelling",
        "improvementSuggestions": ["suggestion1", "suggestion2"],
        "estimatedConversionRate": "High" | "Medium" | "Low"
      }
      
      Ensure the response is valid JSON. Do not include markdown code blocks.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          { inlineData: { mimeType: "image/png", data: base64Image } },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json"
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Error analyzing ad:", error);
    throw error;
  }
};

export const analyzeCommentIntent = async (comments: string[]) => {
  try {
    const model = "gemini-2.5-flash-latest";
    const prompt = `
      Analyze the following social media comments and categorize their intent.
      
      Comments:
      ${JSON.stringify(comments)}
      
      Return a JSON object with an array of results:
      {
        "results": [
          {
            "originalText": "string",
            "intent": "Purchase" | "Inquiry" | "Complaint" | "Spam" | "Endorsement",
            "sentiment": "Positive" | "Negative" | "Neutral",
            "leadScore": number (0-100),
            "suggestedReply": "Write a high-converting, empathetic, and non-robotic reply. If it's a purchase intent, guide them to the bio/link. If it's a complaint, offer help."
          }
        ]
      }
       Ensure the response is valid JSON. Do not include markdown code blocks.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        responseMimeType: "application/json"
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Error analyzing comments:", error);
    throw error;
  }
};

export const generateViralScript = async (adAnalysis: any) => {
  try {
    const model = "gemini-2.5-flash-latest";
    const prompt = `
      Based on the following ad analysis, generate 3 viral script variations for a similar product.
      
      Original Ad Analysis:
      ${JSON.stringify(adAnalysis)}
      
      Generate 3 variations:
      1. "Direct Remix": Follows the same structure but with fresh wording.
      2. "Aggressive Hook": Focuses on a stronger, more controversial hook.
      3. "Storytelling": Uses a personal narrative approach.
      
      Return a JSON object with:
      {
        "variations": [
          {
            "type": "Direct Remix" | "Aggressive Hook" | "Storytelling",
            "hook": "string",
            "script": [
              { "time": "0-3s", "visual": "string", "audio": "string" },
              ...
            ],
            "estimatedViralScore": number
          }
        ]
      }
      Ensure the response is valid JSON.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        responseMimeType: "application/json"
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Error generating scripts:", error);
    throw error;
  }
};
