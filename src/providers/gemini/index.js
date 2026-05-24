import { GoogleGenAI } from "@google/genai";

import { env } from "../../config/env.js";

const ai = new GoogleGenAI({
    apiKey: env.GEMINI_API_KEY,
});

export async function askGemini({ model, systemPrompt, message }) {
    const response = await ai.models.generateContent({
        model: model || env.GEMINI_MODEL,
        contents: [
            {
                role: "user",
                parts: [
                    {
                        text: `${systemPrompt}\n\n${message}`,
                    },
                ],
            },
        ],
    });

    return response.text;
}
