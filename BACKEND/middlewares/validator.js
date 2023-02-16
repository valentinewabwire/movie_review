const { check, validationResult } = require("express-validator");
const { isValidObjectId } = require("mongoose");
const mongoose = require("mongoose");
const genres = require("../utils/genres");
/* An array of validators. */
exports.userValidator = [
  check("name", "Name is missing").trim().not().isEmpty(),
  check("email", "Email is invalid!!").normalizeEmail().isEmail(),
  check("password", "Password is missing!!")
    .trim()
    .not()
    .isEmpty()
    .isLength({ min: 8, max: 20 })
    .withMessage("Password must be 8 to 20 characters"),
];

exports.validatePassword = [
  check("newPassword", "Password is missing!!")
    .trim()
    .not()
    .isEmpty()
    .isLength({ min: 8, max: 20 })
    .withMessage("Password must be 8 to 20 characters"),
];

exports.signInValidator = [
  check("email", "Email is invalid!!").normalizeEmail().isEmail(),
  check("password", "Password is missing!!").trim().not().isEmpty(),
];

exports.actorInfoValidator = [
  check("name", "Name is missing").trim().not().isEmpty(),
  check("about", "About is a required field!").trim().not().isEmpty(),
  check("gender", "Gender is a required field!").trim().not().isEmpty(),
];

/* A middleware function that is used to validate the user input. */
exports.validate = (req, res, next) => {
  const error = validationResult(req).array();
  if (error.length) {
    return res.json({ error: error[0].msg });
  }
  next();
};

exports.validateMovie = [
  check("title", "Movie Title is missing!").trim().not().isEmpty(),
  check("storyLine", "Storyline is important!").trim().not().isEmpty(),
  check("releaseDate", "Release date is missing!").isDate(),
  check("language", "language is missing!").trim().not().isEmpty(),
  check("status", "Movie status must be public or private").isIn([
    "public",
    "private",
  ]),
  check("type", "Movie type is missing!").trim().not().isEmpty(),
  check("genres")
    .isArray()
    .withMessage("Genres must be array of list!")
    .custom((value) => {
      for (let g of value) {
        if (!genres.includes(g)) throw Error("Invalid Genres");
      }
      return true;
    }),
  check("cast")
    .isArray()
    .withMessage("Cast must be an array of objects!")
    .custom((cast) => {
      for (let c of cast) {
        if (!mongoose.Types.ObjectId.isValid(c.id))
          throw Error("Invalid cast id inside cast!");
        if (!c.roleAs?.trim()) throw Error("Role as is missing inside cast!");
        if (typeof c.leadActor !== "boolean")
          throw Error(
            "Only accepted boolean value inside leadActor inside cast!"
          );
      }
      return true;
    }),
  check("trailer")
    .isObject()
    .withMessage("trailer must be an object with url and public_id")
    .custom(({ url, public_id }) => {
      try {
        const result = new URL(url);
        if (
          !result.protocol.includes("http") &&
          !result.protocol.includes("https")
        ) {
          throw Error("Trailer url is invalid 2!");
        }

        const arr = url.split("/");
        const publicId = arr[arr.length - 1].split(".")[0];

        if (public_id !== publicId)
          throw Error("Trailer public_id is invalid!");

        return true;
      } catch (error) {
        throw Error("Trailer url is invalid!");
      }
    }),
  check("poster").custom((_, { req }) => {
    if (!req.file) throw Error("Poster file is missing");
    return true;
  }),
];
