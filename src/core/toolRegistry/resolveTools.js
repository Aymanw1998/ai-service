import { toolRegistry } from "./registry.js";

export function resolveTools(allowedTools = []) {
    return allowedTools.map((toolName) => {
        const tool = toolRegistry[toolName];

        if (!tool) {
            const error = new Error(`Unknown tool in project config: ${toolName}`);
            error.statusCode = 500;
            throw error;
        }

        return tool;
    });
}
