import OpenAI from "openai";

import { env } from "../../config/env.js";

const client = new OpenAI({
    apiKey: env.OPENAI_API_KEY,
});

export async function askOpenAI({ model, systemPrompt, message }) {
    const response = await client.responses.create({
        model: model || env.OPENAI_MODEL,
        instructions: systemPrompt,
        input: message,
    });

    return response.output_text;
}
