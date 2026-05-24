const allowedRoles = new Set(["user", "assistant", "system"]);

export function normalizeHistory(history = []) {
    if (!Array.isArray(history)) {
        return [];
    }

    return history
        .filter((entry) => entry && allowedRoles.has(entry.role) && typeof entry.content === "string")
        .slice(-20)
        .map((entry) => ({
            role: entry.role,
            content: entry.content.trim(),
        }))
        .filter((entry) => entry.content);
}
