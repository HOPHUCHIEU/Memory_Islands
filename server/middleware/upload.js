import multer from "multer";
const maxFileSize = Number(process.env.MAX_FILE_SIZE || 20 * 1024 * 1024);
const storage = multer.memoryStorage();
function fileFilter(req, file, callback) {
  if (!file.mimetype.startsWith("image/")) {
    return callback(new Error("Only image files are allowed"));
  }
  callback(null, true);
}
export const upload = multer({
  storage,
  limits: { fileSize: maxFileSize },
  fileFilter,
});
