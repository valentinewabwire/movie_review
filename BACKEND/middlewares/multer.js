const multer = require("multer");
const storage = multer.diskStorage({});

/**
 * If the file is not an image, then return an error message and false.
 * If the file is an image, then return null and true.
 * @param req - The request object.
 * @param file - The file that was uploaded.
 * @param cb - callback function
 */
const imageFileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image")) {
    cb("Supported only image files!", false);
  }
  cb(null, true);
};
/**
 * If the file mimetype doesn't start with "video", then return an error message and false. Otherwise,
 * return null and true.
 * @param req - The request object.
 * @param file - The file that was uploaded.
 * @param cb - callback function
 */
const videoFileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("video")) {
    cb("Supported only video files!", false);
  }
  cb(null, true);
};

exports.uploadImage = multer({ storage, fileFilter: imageFileFilter });
exports.uploadVideo = multer({ storage, fileFilter: videoFileFilter });
