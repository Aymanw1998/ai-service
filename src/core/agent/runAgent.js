import { loadProject } from "../projects/loadProject.js";
import { assertProjectAccess } from "../permissions/assertProjectAccess.js";
import { resolveTools } from "../toolRegistry/resolveTools.js";
import { runProvider } from "../providerRouter/runProvider.js";
import { buildAgentPrompt, buildUserTask } from "./buildAgentPrompt.js";
import { normalizeHistory } from "./normalizeHistory.js";
import { getRuntimeContext } from "./runtimeContext.js";

export async function runAgent({ projectId, message, context = {}, history = [], user }) {
    const project = await loadProject(projectId);

    assertProjectAccess({
        project,
        user,
    });

    const tools = resolveTools(project.tools);
    const normalizedHistory = normalizeHistory(history);
    const systemPrompt = buildAgentPrompt({
        project,
        tools,
    });
    const userTask = buildUserTask({
        message,
        context: {
            ...context,
            runtime: getRuntimeContext(),
            project: project.config,
        },
        history: normalizedHistory,
    });

    const answer = await runProvider({
        provider: project.config.provider,
        model: project.config.model,
        systemPrompt,
        message: userTask,
    });

    return {
        project: project.id,
        projectName: project.name,
        provider: project.config.provider,
        model: project.config.model,
        tools: tools.map((tool) => tool.name),
        historyUsed: normalizedHistory.length,
        answer,
    };
}
