const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");

// Configure Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "studentBridge_uploads", // Folder name in Cloudinary
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

// Multer upload with size & file limits
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB max size
    files: 3, // Max 3 images
  },
});

module.exports = upload;
