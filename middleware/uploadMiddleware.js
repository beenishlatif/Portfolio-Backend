import multer from "multer";

// Memory storage - the file never touches the server's disk, which is
// required on Vercel since serverless functions have a read-only /
// ephemeral filesystem. The buffer is streamed straight to Cloudinary
// in the controller.
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const isImage = file.mimetype.startsWith("image/");
  const isVideo = file.mimetype.startsWith("video/");
  if (isImage || isVideo) {
    cb(null, true);
  } else {
    cb(new Error("Only image or video files are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB - generous enough for short demo videos
});

export default upload;