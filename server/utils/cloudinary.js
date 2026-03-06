import { Readable } from "stream";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const FOLDER = "medtech/doctors";

/**
 * Upload a file buffer to Cloudinary and return the secure URL.
 * @param {Buffer} buffer - File buffer
 * @param {Object} options - { folder?: string, publicId?: string }
 * @returns {Promise<string>} Secure URL of the uploaded asset
 */
export const uploadToCloudinary = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder: options.folder || FOLDER,
      resource_type: "image",
      ...options,
    };

    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (err, result) => {
        if (err) return reject(err);
        if (!result?.secure_url) return reject(new Error("No URL returned from Cloudinary"));
        resolve(result.secure_url);
      }
    );

    Readable.from(buffer).pipe(uploadStream);
  });
};

export default cloudinary;
