export function assertProjectAccess({ project }) {
    if (!project.config.enabled) {
        const error = new Error(`Project is disabled: ${project.id}`);
        error.statusCode = 403;
        throw error;
    }
}
