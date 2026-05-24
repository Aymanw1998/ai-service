import dotenv from "dotenv";

dotenv.config();

export const env = {
    PORT: process.env.PORT || 7000,

    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    AI_SERVICE_TOKEN: process.env.AI_SERVICE_TOKEN,
    
    AI_PROVIDER: process.env.AI_PROVIDER || "openai",
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,

    GEMINI_MODEL: process.env.GEMINI_MODEL || "gemini-2.5-flash",
    OPENAI_MODEL: process.env.OPENAI_MODEL || "gpt-4o-mini",
    OLLAMA_BASE_URL: process.env.OLLAMA_BASE_URL || "http://localhost:11434",
    OLLAMA_MODEL: process.env.OLLAMA_MODEL || "llama3.1",
    TIMEZONE: process.env.TIMEZONE || "Asia/Jerusalem",
};


