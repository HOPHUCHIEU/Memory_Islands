import mongoose from "mongoose";
import { GridFSBucket, ObjectId } from "mongodb";
let gridFSBucket;
export function initializeGridFS() {
  const database = mongoose.connection.db;
  if (!database) {
    throw new Error("MongoDB database is not connected");
  }
  gridFSBucket = new GridFSBucket(database, { bucketName: "images" });
  console.log("GridFS initialized");
}
export function getGridFSBucket() {
  if (!gridFSBucket) {
    throw new Error("GridFS has not been initialized");
  }
  return gridFSBucket;
}
export function uploadImage(buffer, filename, contentType) {
  return new Promise((resolve, reject) => {
    const bucket = getGridFSBucket();
    const uploadStream = bucket.openUploadStream(filename, {
      contentType,
      metadata: { uploadedAt: new Date() },
    });
    uploadStream.on("error", reject);
    uploadStream.on("finish", () => {
      resolve(uploadStream.id);
    });
    uploadStream.end(buffer);
  });
}
export function deleteImage(imageId) {
  return new Promise((resolve, reject) => {
    const bucket = getGridFSBucket();
    bucket.delete(new ObjectId(imageId), (error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve();
    });
  });
}
