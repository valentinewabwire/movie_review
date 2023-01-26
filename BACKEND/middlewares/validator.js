const { check, validationResult } = require("express-validator");
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

/* A middleware function that is used to validate the user input. */
exports.validate = (req, res, next) => {
  const error = validationResult(req).array();
  if (error.length) {
    return res.json({ error: error[0].msg });
  }
  next();
};
