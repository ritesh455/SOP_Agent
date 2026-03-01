const express = require("express");
const multer = require("multer");
const { uploadDocument } = require("../controllers/document.controller");
const { requireAuth, requireAdmin } = require("../middleware/auth.middleware");

const router = express.Router();

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files are allowed"));
    }
    cb(null, true);
  }
});

// ✅ SINGLE, CORRECT ROUTE
router.post(
  "/upload",
  requireAuth,
  requireAdmin,
  upload.array("files", 10),
  uploadDocument
);

module.exports = router;
