const crypto = require("crypto");
const cloudinary = require("../cloud");
exports.sendError = (res, error, statusCode = 401) => {
  res.status(statusCode).json({ error });
};

/* Generating a random byte. */
exports.generateRandomByte = () => {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(30, (err, buff) => {
      if (err) return reject(err);
      const buffString = buff.toString("hex");
      // console.log(buffString);
      resolve(buffString);
    });
  });
};

/* A function that takes in a request and a response and returns a 404 error. */
exports.handleNotFound = (req, res) => {
  this.sendError(res, "Not Found", 404);
};

/* Uploading an image to cloudinary. */
exports.uploadImageTocloud = async (file) => {
  const { secure_url: url, public_id } = await cloudinary.uploader.upload(
    file.path,
    { gravity: "face", height: 500, width: 500, crop: "thumb" }
  );
  return { url, public_id };
};

/* A function that takes in an actor and returns an object with the actor's name, gender, about, id,
and avatar. */
exports.formatActor = (actor) => {
  const { name, gender, about, _id, avatar } = actor;
  return {
    id: _id,
    name,
    about,
    gender,
    avatar: avatar?.url,
  };
};
