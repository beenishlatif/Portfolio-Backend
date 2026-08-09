import streamifier from "streamifier";
import cloudinary from "../config/cloudinary.js";

// @route POST /api/upload   (PROTECTED)
// Accepts a single file field named "file" (see uploadMiddleware.js), streams
// it directly to Cloudinary from memory, and returns the resulting URL.
// resource_type: "auto" lets Cloudinary detect image vs video on its own.
export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const streamUpload = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "portfolio",
            resource_type: "auto",
          },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });

    const result = await streamUpload();

    res.json({ url: result.secure_url });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
};