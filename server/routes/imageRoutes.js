// import express from "express";
// import {
//   createMemory,
//   getMemories,
//   getMemoryById,
// } from "../controllers/memoryController.js";
// import { upload } from "../middleware/upload.js";
// const router = express.Router();
// router.get("/", getMemories);
// router.get("/:id", getMemoryById);
// router.post("/", upload.single("image"), createMemory);
// export default router;

// import express from "express";
// import { ObjectId } from "mongodb";
// import { getGridFSBucket } from "../services/gridfs.js";

// const router = express.Router();

// router.get("/:id", async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!ObjectId.isValid(id)) {
//       return res.status(400).json({
//         message: "Invalid image ID"
//       });
//     }

//     const bucket = getGridFSBucket();

//     const files = await bucket
//       .find({ _id: new ObjectId(id) })
//       .toArray();

//     if (!files.length) {
//       return res.status(404).json({
//         message: "Image not found"
//       });
//     }

//     const file = files[0];

//     res.set({
//       "Content-Type": file.contentType || "application/octet-stream",
//       "Content-Length": file.length,
//       "Cache-Control": "public, max-age=31536000"
//     });

//     const downloadStream = bucket.openDownloadStream(
//       new ObjectId(id)
//     );

//     downloadStream.on("error", (error) => {
//       console.error("GridFS download error:", error);

//       if (!res.headersSent) {
//         res.status(500).json({
//           message: "Failed to load image"
//         });
//       }
//     });

//     downloadStream.pipe(res);

//   } catch (error) {
//     console.error("Get image error:", error);

//     if (!res.headersSent) {
//       res.status(500).json({
//         message: "Failed to load image"
//       });
//     }
//   }
// });

// export default router;

import express from "express";
import { ObjectId } from "mongodb";
import { getGridFSBucket } from "../services/gridfs.js";

const router = express.Router();

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid image ID",
      });
    }

    const bucket = getGridFSBucket();
    const objectId = new ObjectId(id);

    const files = await bucket.find({ _id: objectId }).toArray();

    if (!files.length) {
      return res.status(404).json({
        message: "Image not found",
      });
    }

    const file = files[0];

    res.set({
      "Content-Type": file.contentType || "application/octet-stream",
      "Content-Length": file.length,
      "Cache-Control": "public, max-age=31536000",
    });

    const downloadStream = bucket.openDownloadStream(objectId);

    downloadStream.on("error", (error) => {
      console.error("GridFS download error:", error);

      if (!res.headersSent) {
        res.status(500).json({
          message: "Failed to load image",
        });
      }
    });

    downloadStream.pipe(res);
  } catch (error) {
    console.error("Get image error:", error);

    if (!res.headersSent) {
      res.status(500).json({
        message: "Failed to load image",
      });
    }
  }
});

export default router;
