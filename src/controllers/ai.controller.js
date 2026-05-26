import OpenAI from "openai";

import { env } from "../config/env.js";
import { askGemini } from "../providers/gemini/index.js";
import { askOllama } from "../providers/ollama/index.js";

const DEFAULT_SYSTEM_PROMPT = `You are a global AI assistant service used by multiple projects.
Answer clearly and practically.
Use the same language as the user.
If project-specific context is provided, use it.
If data is missing, explain what backend data is needed.`;

const TAMHEED_SYSTEM_PROMPT = `You are Tamheed AI, an assistant inside the Tamheed Association System.
You help users understand and manage events, students, teachers, lessons, documents, reports, schedules, users, and system settings.
Answer clearly and practically.
Use the same language as the user.
If you need database data that was not provided in the context, explain that the backend needs to fetch it first.`;

const getSystemPrompt = (project) => {
  if (String(project || "").toLowerCase() === "tamheed") {
    return TAMHEED_SYSTEM_PROMPT;
  }

  return DEFAULT_SYSTEM_PROMPT;
};

const buildUserInput = ({ message, context, project, source }) => {
  return JSON.stringify(
    {
      project,
      source,
      context,
      message,
    },
    null,
    2
  );
};

const askOpenAI = async ({ systemPrompt, input }) => {
  if (!env.OPENAI_API_KEY) {
    const error = new Error("OPENAI_API_KEY is missing in AI-SERVICE");
    error.statusCode = 500;
    throw error;
  }

  const client = new OpenAI({
    apiKey: env.OPENAI_API_KEY,
  });

  const response = await client.responses.create({
    model: env.OPENAI_MODEL || "gpt-4o-mini",
    instructions: systemPrompt,
    input,
  });

  return response.output_text || "";
};

const askConfiguredProvider = async ({ systemPrompt, input }) => {
  const provider = String(env.AI_PROVIDER || "openai").toLowerCase();

  if (provider === "ollama") {
    return askOllama({
      model: env.OLLAMA_MODEL,
      systemPrompt,
      message: input,
    });
  }

  if (provider === "openai") {
    return askOpenAI({
      systemPrompt,
      input,
    });
  }

  if (provider === "gemini") {
    return askGemini({
      model: env.GEMINI_MODEL,
      systemPrompt,
      message: input,
    });
  }

  const error = new Error(`Unsupported AI_PROVIDER: ${provider}`);
  error.statusCode = 400;
  throw error;
};

export async function chat(req, res) {
  try {
    const {
      message,
      context = {},
      project = "global",
      source = "global-server",
    } = req.body || {};

    console.log("[AI Service] Incoming /api/ai/chat request", {
      project,
      source,
      message,
      context,
    });

    if (!message || !String(message).trim()) {
      return res.status(400).json({
        success: false,
        message: "message is required",
      });
    }

    const answer = await askConfiguredProvider({
      systemPrompt: getSystemPrompt(project),
      input: buildUserInput({
        message: String(message).trim(),
        context,
        project,
        source,
      }),
    });

    console.log("[AI Service] Provider returned answer", {
      project,
      source,
      answer,
    });

    return res.json({
      success: true,
      answer,
    });
  } catch (error) {
    console.error("AI SERVICE ERROR FULL:", error);
    console.error("MESSAGE:", error?.message);
    console.error("RESPONSE:", error?.response?.data);

    return res.status(error?.statusCode || 500).json({
      success: false,
      message: error?.message || "AI service request failed",
    });
  }
}
