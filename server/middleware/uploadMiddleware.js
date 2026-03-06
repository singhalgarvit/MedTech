import multer from "multer";
import { uploadToCloudinary } from "../utils/cloudinary.js";

const storage = multer.memoryStorage();

const uploadFields = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB per file
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPEG, PNG, and WebP are allowed."), false);
    }
  },
}).fields([
  { name: "img", maxCount: 1 },
  { name: "doctorIdCard", maxCount: 1 },
]);

/**
 * Multer middleware for doctor registration (use on route before body shaping).
 */
export const doctorUpload = (req, res, next) => {
  uploadFields(req, res, (err) => {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(413).json({ error: "File too large. Max 2MB per image." });
      }
      return res.status(400).json({ error: err.message || "File upload failed." });
    }
    next();
  });
};

/**
 * Uploads img and doctorIdCard to Cloudinary and shapes req.body for doctorSchema.
 * Must run after doctorUpload (multer). Expects req.files.img and req.files.doctorIdCard.
 */
export const cloudinaryUploadAndShapeBody = async (req, res, next) => {
  try {
    const imgFile = req.files?.img?.[0];
    const idCardFile = req.files?.doctorIdCard?.[0];

    if (!imgFile || !idCardFile) {
      return res.status(400).json({
        error: "Both profile image (img) and ID card image (doctorIdCard) are required.",
      });
    }

    const [imgUrl, doctorIdCardUrl] = await Promise.all([
      uploadToCloudinary(imgFile.buffer, { folder: "medtech/doctors/profile" }),
      uploadToCloudinary(idCardFile.buffer, { folder: "medtech/doctors/idcard" }),
    ]);

    req.body.img = imgUrl;
    req.body.doctorIdCard = doctorIdCardUrl;
    req.body.isVerified = false;

    // Parse string fields that must be numbers or structured
    if (typeof req.body.experience === "string") {
      req.body.experience = parseInt(req.body.experience, 10);
    }
    if (typeof req.body.consultationFee === "string") {
      req.body.consultationFee = parseFloat(req.body.consultationFee);
    }
    if (typeof req.body.availableDays === "string") {
      try {
        req.body.availableDays = JSON.parse(req.body.availableDays);
      } catch {
        req.body.availableDays = req.body.availableDays ? [req.body.availableDays] : [];
      }
    }
    if (typeof req.body.availableTime === "string") {
      try {
        req.body.availableTime = JSON.parse(req.body.availableTime);
      } catch {
        req.body.availableTime = {
          start: req.body.availableTimeStart || "",
          end: req.body.availableTimeEnd || "",
        };
      }
    }
    if (req.body.availableTime && (req.body.availableTimeStart ?? req.body.availableTimeEnd)) {
      req.body.availableTime = {
        start: req.body.availableTime.start || req.body.availableTimeStart || "",
        end: req.body.availableTime.end || req.body.availableTimeEnd || "",
      };
    }

    next();
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    res.status(500).json({ error: "Failed to upload images. Please try again." });
  }
};
