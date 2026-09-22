import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDatabase } from "./config/db.js";
import Memory from "./models/Memory.js";
import memoryRoutes from "./routes/memoryRoutes.js";
import imageRoutes from "./routes/imageRoutes.js";
import { initializeGridFS } from "./services/gridfs.js";
const app = express();
const PORT = Number(process.env.PORT || 5000);
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Memory API is running" });
});
app.use("/api/memories", memoryRoutes);
app.use("/api/images", imageRoutes);
async function startServer() {
  try {
    console.log("=================================");
    console.log("Starting Memory Website server...");
    console.log("=================================");

    await connectDatabase();
    console.log("MongoDB connection completed.");
    await Memory.createCollection();
    console.log("Memory collection ready.");
    await Memory.createIndexes();
    console.log("Memory indexes ready.");
    initializeGridFS();
    console.log("GridFS initialized.");
    app.listen(PORT, () => {
      console.log("---------------------------------");
      console.log(`Server running on port ${PORT}`);
      console.log(`http://localhost:${PORT}`);
      console.log("---------------------------------");
    });
  } catch (error) {
    console.error("");
    console.error("=================================");
    console.error("FAILED TO START SERVER");
    console.error("=================================");
    console.error(error);
    console.error("=================================");
    process.exit(1);
  }
}
startServer();
