import { env } from "../config/env.js";

export function authMiddleware(req, res, next) {
    const token = req.headers["x-ai-service-token"];

    if (!token || token !== env.AI_SERVICE_TOKEN) {
        return res.status(401).json({
        success: false,
        message: "Unauthorized AI request",
        });
    }

    next();
}
