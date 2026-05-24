import { env } from "../../config/env.js";

export async function askOllama({ model, systemPrompt, message }) {
    const response = await fetch(`${env.OLLAMA_BASE_URL}/api/chat`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: model || env.OLLAMA_MODEL,
            stream: false,
            messages: [
                {
                    role: "system",
                    content: systemPrompt,
                },
                {
                    role: "user",
                    content: message,
                },
            ],
        }),
    });

    if (!response.ok) {
        throw new Error(`Ollama request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.message?.content || "";
}
