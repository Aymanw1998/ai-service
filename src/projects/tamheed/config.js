import { env } from "../../config/env.js";

export const config = {
    enabled: true,
    provider: env.AI_PROVIDER,
    model: env.AI_PROVIDER === "openai"
        ? env.OPENAI_MODEL
        : env.AI_PROVIDER === "ollama"
            ? env.OLLAMA_MODEL
            : env.GEMINI_MODEL,
    memory: {
        enabled: false,
    },
    permissions: {
        allowToolExecution: false,
    },
};
