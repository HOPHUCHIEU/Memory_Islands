import "dotenv/config";
import express from "express";
import cors from "cors";

import memoryRoutes from "./routes/memoryRoutes.js";
import imageRoutes from "./routes/imageRoutes.js";

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173"
}));

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Memory API is running"
  });
});

app.use("/api/memories", memoryRoutes);
app.use("/api/images", imageRoutes);

export default app;