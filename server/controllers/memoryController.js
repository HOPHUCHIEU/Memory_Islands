
import Memory from "../models/Memory.js";
import {
  uploadImage,
  getGridFSBucket,
  deleteImage
} from "../services/gridfs.js";

import { ObjectId } from "mongodb";

export async function createMemory(req, res) {
  try {
    const { message, date } = req.body;

    if (!req.file) {
      return res.status(400).json({
        message: "Image is required"
      });
    }

    if (!message || !message.trim()) {
      return res.status(400).json({
        message: "Message is required"
      });
    }

    if (!date) {
      return res.status(400).json({
        message: "Date is required"
      });
    }

    const imageId = await uploadImage(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype
    );

    try {
      const memory = await Memory.create({
        imageId,
        imageFilename: req.file.originalname,
        imageContentType: req.file.mimetype,
        imageSize: req.file.size,
        message: message.trim(),
        date: new Date(date)
      });

      return res.status(201).json({
        message: "Memory created successfully",
        data: memory
      });
    } catch (databaseError) {
      await deleteImage(imageId);

      throw databaseError;
    }
  } catch (error) {
    console.error("Create memory error:", error);

    return res.status(500).json({
      message: "Failed to create memory"
    });
  }
}

export async function getMemories(req, res) {
  try {
    const memories = await Memory.find()
      .sort({ date: -1, createdAt: -1 })
      .lean();

    const result = memories.map((memory) => ({
      ...memory,
      imageUrl: `/api/images/${memory.imageId}`
    }));

    return res.json({
      data: result
    });
  } catch (error) {
    console.error("Get memories error:", error);

    return res.status(500).json({
      message: "Failed to get memories"
    });
  }
}

export async function getMemoryById(req, res) {
  try {
    const memory = await Memory.findById(req.params.id).lean();

    if (!memory) {
      return res.status(404).json({
        message: "Memory not found"
      });
    }

    return res.json({
      data: {
        ...memory,
        imageUrl: `/api/images/${memory.imageId}`
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to get memory"
    });
  }
}

export async function getImage(req, res) {
  try {
    const imageId = req.params.id;

    if (!ObjectId.isValid(imageId)) {
      return res.status(400).json({
        message: "Invalid image ID"
      });
    }

    const bucket = getGridFSBucket();

    const files = await bucket
      .find({
        _id: new ObjectId(imageId)
      })
      .toArray();

    if (!files.length) {
      return res.status(404).json({
        message: "Image not found"
      });
    }

    const file = files[0];

    res.set(
      "Content-Type",
      file.contentType || "application/octet-stream"
    );

    res.set(
      "Content-Length",
      String(file.length)
    );

    const downloadStream = bucket.openDownloadStream(
      new ObjectId(imageId)
    );

    downloadStream.on("error", (error) => {
      console.error("Image stream error:", error);

      if (!res.headersSent) {
        res.status(500).end();
      }
    });

    downloadStream.pipe(res);
  } catch (error) {
    console.error("Get image error:", error);

    if (!res.headersSent) {
      res.status(500).json({
        message: "Failed to get image"
      });
    }
  }
}
