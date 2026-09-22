import "dotenv/config";
import express from "express";
import cors from "cors";

import { connectDatabase } from "./config/db.js";
import Memory from "./models/Memory.js";
import memoryRoutes from "./routes/memoryRoutes.js";
import imageRoutes from "./routes/imageRoutes.js";
import { initializeGridFS } from "./services/gridfs.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  }),
);

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Memory API is running",
  });
});

app.use("/api/memories", memoryRoutes);
app.use("/api/images", imageRoutes);

let initialized = false;

async function initialize() {
  if (initialized) return;

  await connectDatabase();
  await Memory.createCollection();
  await Memory.createIndexes();
  initializeGridFS();

  initialized = true;
}

app.use(async (req, res, next) => {
  try {
    await initialize();
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server initialization failed",
    });
  }
});

const isVercel = process.env.VERCEL === "1";

if (!isVercel) {
  const PORT = Number(process.env.PORT || 5000);

  initialize()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    })
    .catch((error) => {
      console.error("FAILED TO START SERVER");
      console.error(error);
      process.exit(1);
    });
}

export default app;
