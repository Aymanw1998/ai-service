import OpenAI from "openai";

import { env } from "../config/env.js";

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

export async function chat(req, res) {
  try {
    const {
      message,
      context = {},
      project = "global",
      source = "global-server",
    } = req.body || {};

    if (!message || !String(message).trim()) {
      return res.status(400).json({
        success: false,
        message: "message is required",
      });
    }

    if (!env.OPENAI_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "OPENAI_API_KEY is missing in AI-SERVICE",
      });
    }

    const client = new OpenAI({
      apiKey: env.OPENAI_API_KEY,
    });

    const response = await client.responses.create({
      model: env.OPENAI_MODEL || "gpt-4o-mini",
      instructions: getSystemPrompt(project),
      input: buildUserInput({
        message: String(message).trim(),
        context,
        project,
        source,
      }),
    });

    return res.json({
      success: true,
      answer: response.output_text || "",
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
