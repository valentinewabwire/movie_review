const multer = require("multer");
const storage = multer.diskStorage({});

/**
 * If the file is not an image, then return an error message and false.
 * If the file is an image, then return null and true.
 * @param req - The request object.
 * @param file - The file that was uploaded.
 * @param cb - callback function
 */
const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image")) {
    cb("Supported only image files!", false);
  }
  cb(null, true);
};

exports.uploadImage = multer({ storage, fileFilter });
