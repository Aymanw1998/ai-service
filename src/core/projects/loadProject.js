const projectLoaders = {
    tamheed: () => import("../../projects/tamheed/index.js"),
    "tamheed-association-system": () => import("../../projects/tamheed/index.js"),
};

export async function loadProject(projectId) {
    const normalizedProjectId = normalizeProjectId(projectId);
    const load = projectLoaders[normalizedProjectId];

    if (!load) {
        const error = new Error(`Unknown project: ${projectId}`);
        error.statusCode = 404;
        throw error;
    }

    const module = await load();
    return module.default;
}

function normalizeProjectId(projectId = "") {
    return String(projectId).trim().toLowerCase();
}
