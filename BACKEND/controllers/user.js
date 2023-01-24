const crypto = require("crypto");
const User = require("../models/user");
const EmailVerificationToken = require("../models/emailVerificationToken");
const PasswordResetToken = require("../models/passwordResetToken");
const { isValidObjectId } = require("mongoose");
const { generateOTP, generateMailTransporter } = require("../utils/mail");
const { sendError, generateRandomByte } = require("../utils/helper");

exports.create = async (req, res) => {
  const { name, email, password } = req.body;

  const oldUser = await User.findOne({ email });
  /* This is checking if the user already exists in the database. If it does, it will return an error. */
  if (oldUser) return sendError(res, "This email is already is use!!");

  /* This is creating a new user and saving it to the database. */
  const newUser = new User({ name, email, password });
  await newUser.save();

  // Generate 6 digit OTP
  let OTP = generateOTP();

  //store otp to our DB
  const newEmailVerificationToken = new EmailVerificationToken({
    owner: newUser._id,
    token: OTP,
  });

  await newEmailVerificationToken.save();
  //send otp to user

  var transport = generateMailTransporter();

  transport.sendMail({
    from: "verification@pes.co.ke",
    to: newUser.email,
    subject: "Confirm your email to start using Movie review",
    html: `
    <p>You're well on your way to setting up your Movie review account. We just need to verify your email. </p>
    <p>Your verification OTP code</p>
    <h1>${OTP}</h1>
    `,
  });

  res.status(201).json({
    message:
      "Please verify your email. OTP has been sent to your email account!",
  });
};

/* This is the function that will be called when the user clicks on the link in the email. It will
check if the user exists in the database and if the token is valid. If it is, it will update the
user's isVerified field to true. */
exports.verifyEmail = async (req, res) => {
  const { userId, OTP } = req.body;

  if (!isValidObjectId(userId)) return sendError(res, "Invalid user!");

  const user = await User.findById(userId);
  if (!user) return sendError(res, "User not found!", 404);

  if (user.isVerified) return sendError(res, "User is already verified");

  const token = await EmailVerificationToken.findOne({ owner: userId });
  if (!token) return sendError(res, "Token Not found");

  const isMatched = await token.compareToken(OTP);
  if (!isMatched) return sendError(res, "Please submit a valid OTP!!");

  user.isVerified = true;
  await user.save();

  await EmailVerificationToken.findByIdAndDelete(token._id);
  //   console.log(token._id);

  var transport = generateMailTransporter();

  transport.sendMail({
    from: "verification@pes.co.ke",
    to: user.email,
    subject: "Welcome Email",
    html: `
    <h1>Welcome to our app and thanks for choosing us.😊</h1>
    `,
  });

  res.json({ message: "Your email is verified" });
};

exports.resendEmailVerificationToken = async (req, res) => {
  const { userId } = req.body;

  const user = await User.findById(userId);
  if (!user) return sendError(res, "Invalid user!");

  if (user.isVerified)
    return sendError(res, "This email id is already verified");

  const alreadyHasToken = await EmailVerificationToken.findOne({
    owner: userId,
  });
  if (alreadyHasToken)
    return sendError(res, "Only after hour you can request for another token");

  // Generate 6 digit OTP
  let OTP = generateOTP();
  //store otp to our DB
  const newEmailVerificationToken = new EmailVerificationToken({
    owner: user._id,
    token: OTP,
  });

  await newEmailVerificationToken.save();
  //send otp to user

  var transport = generateMailTransporter();

  transport.sendMail({
    from: "verification@pes.co.ke",
    to: user.email,
    subject: "OTP REQUEST",
    html: `
    <p>Ypu have requested for new OTP kindly use the below</p>
    <p>Your verification OTP code</p>
    <h1>${OTP}</h1>
    `,
  });

  res.json({ message: "New OTP has been sent to your registered account" });
};

/* This is the function that will be called when the user clicks on the link in the email. It will
check if the user exists in the database and if the token is valid. If it is, it will update the
user's isVerified field to true. */
exports.forgetPassword = async (req, res) => {
  /* This is checking if the email is in the request body. If it isn't, it will return an error. */
  const { email } = req.body;
  if (!email) return sendError(res, "Email is missing!!");

  /* This is checking if the user exists in the database. If they don't, it will return an error. */
  const user = await User.findOne({ email });
  if (!user) return sendError(res, "USer not found!", 404);

  /* This is checking if the user already has a token. If they do, it will return an error. */
  const alreadyHasToken = await PasswordResetToken.findOne({ owner: user._id });
  if (alreadyHasToken)
    return sendError(res, "Only after an hour you can reset the password");

  /* Generating a random token and saving it to the database. */
  const token = await generateRandomByte();
  const newPasswordResetToken = await PasswordResetToken({
    owner: user._id,
    token,
  });

  await newPasswordResetToken.save();

  /* This is creating a link that will be sent to the user's email. The user will click on this link
  and it will take them to the reset password page. */
  const resetPasswordUrl = `http://localhost:3200/reset-password?token=${token}&id=${user._id}`;

  /* Creating a transporter object that will be used to send the email. */
  const transport = generateMailTransporter();

  transport.sendMail({
    from: "security@pes.co.ke",
    to: user.email,
    subject: "Reset Password Link",
    html: `
    <p>Click here to reset password</p>
    <a href='${resetPasswordUrl}'>Change Password</a>
    `,
  });

  res.json({ message: "Link Sent to your email!" });
};

exports.sendResetPasswordTokenStatus = (req, res) => {
  res.json({ valid: true });
};

exports.resetPassword = async (req, res) => {
  const { newPassword, userId } = req.body;

  const user = await User.findById(userId);
  const matched = await user.comparePassword(newPassword);
  if (matched)
    return sendError(
      res,
      "The new password must be different from the old one!"
    );

  user.password = newPassword;
  await user.save();

  await PasswordResetToken.findByIdAndDelete(req.resetToken._id);
  /* Creating a transporter object that will be used to send the email. */
  const transport = generateMailTransporter();

  transport.sendMail({
    from: "security@pes.co.ke",
    to: user.email,
    subject: "Password Reset Successfully",
    html: `
      <h1>Password Reset Successfully</h1>
      <p>Now you can use th enew password<p>
      `,
  });

  res.json({
    message: "Password reset successfully, now you can use new password",
  });
};
