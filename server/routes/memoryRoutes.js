import express from "express";
import {
  createMemory,
  getMemories,
  getMemoryById,
} from "../controllers/memoryController.js";
import { upload } from "../middleware/upload.js";
const router = express.Router();
router.get("/", getMemories);
router.get("/:id", getMemoryById);
router.post("/", upload.single("image"), createMemory);
export default router;

