const providerLoaders = {
    gemini: async () => (await import("../../providers/gemini/index.js")).askGemini,
    openai: async () => (await import("../../providers/openai/index.js")).askOpenAI,
    ollama: async () => (await import("../../providers/ollama/index.js")).askOllama,
};

export async function runProvider({ provider, model, systemPrompt, message, context }) {
    const loadProvider = providerLoaders[provider];

    if (!loadProvider) {
        const error = new Error(`Unsupported AI provider: ${provider}`);
        error.statusCode = 400;
        throw error;
    }

    const ask = await loadProvider();

    return ask({
        model,
        systemPrompt,
        message,
        context,
    });
}
