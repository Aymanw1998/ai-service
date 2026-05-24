import express from "express";
import cors from "cors";

import aiRoutes from "./routes/ai.routes.js";

const app = express();

app.use(cors());

app.use(express.json({limit: "2mb", extended: true}));

app.get("/health", (req, res) => {
    res.json({
        success: true,
        service: "ai-service",
        status: "running",
    });
});

app.use("/api/ai", aiRoutes);

export default app;