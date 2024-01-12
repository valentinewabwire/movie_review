const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const EmailVerificationToken = require("../models/emailVerificationToken");
const PasswordResetToken = require("../models/passwordResetToken");
const { isValidObjectId } = require("mongoose");
const { generateOTP, generateMailTransporter } = require("../utils/mail");
const { sendError, generateRandomByte } = require("../utils/helper");
const ejs = require("ejs");
const path = require("path");
const baseUrl = process.env.BASE_URL || "http://localhost:3000/"; // Fallback to localhost if not set

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
    <p>Dear ${name}</p>
    <p>Thanks for joining our movie review site! To ensure that we have your correct email address, <br>we need you to confirm your email by entering the OTP (One-Time Password) below.</p>
    <h1>OTP ${OTP}</h1>
    <p>Once you've confirmed your email, you'll be able to start using our site and enjoying all the benefits it has to offer. You'll be able to access the latest movie reviews, trailers, news, and more.</p>
    `,
  });

  /* This is sending a response to the client. The 201 status code means that the request was successful
and a new resource was created. The response body is the user object that was created. */
  res.status(201).json({
    user: {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    },
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
  // ejs.renderFile("views/welcome_email.ejs", { user: user }, (err, html) => {
  //   if (err) {
  //     console.error("Error rendering EJS template:", err);
  //     return;
  //   }

  //   transport.sendMail({
  //     from: "verification@pes.co.ke",
  //     to: user.email,
  //     subject: "Welcome Email",
  //     html: html,
  //   });
  // });
  transport.sendMail({
    from: "verification@pes.co.ke",
    to: user.email,
    subject: "Welcome Email",
    html: `
    <p>Dear ${user.name},</p>
    <p>We are thrilled to have you join our movie review community! Whether you're a passionate film buff or just a casual moviegoer, we're confident that you'll love the features and benefits of our site.</p>
    <p>Here's what you can expect:</p>
    <ul>
      <li>Access to our extensive database of movie reviews, ratings, trailers, and more</li>
      <li>The ability to create your own movie lists and share them with others</li>
      <li>Recommendations based on your personal preferences and viewing history</li>
      <li>Opportunities to connect with other movie fans and engage in discussions and events</li>
    </ul>
    <p>To start taking advantage of all that our site has to offer, simply log in using the email address and password that you used when signing up. If you have any questions or issues, our support team is always here to help.</p>
    <p>Best regards,</p>
    `,
  });

  const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

  /* This is sending a response to the client. The 201 status code means that the request was successful
and a new resource was created. The response body is the user object that was created. */
  res.json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      token: jwtToken,
      isVerified: user.isVerified,
      role: user.role,
    },
    message: "Your email is verified",
  });
};

/* The above code is a JavaScript function that is used to resend an email verification token to a
user. */
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
    <p>Dear ${user.name},</p>
    <p>We are reaching out to confirm that you recently requested an OTP (One-Time Password) for your account. To ensure the security of your information, we require this additional authentication step.</p>
    <h1>Your OTP is: <strong>${OTP}</strong></h1>
    <p>Please use this code within the next 10 minutes to complete your request. If you did not initiate this request, please contact our support team immediately to report any suspicious activity.</p>
    <p>Thank you for your understanding and cooperation in keeping your account secure.</p>
    <p>Best regards,</p>
    <p>Movie Review Team</p>
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
  const resetPasswordUrl = `${baseUrl}auth/reset-password?token=${token}&id=${user._id}`;

  /* Creating a transporter object that will be used to send the email. */
  const transport = generateMailTransporter();

  transport.sendMail({
    from: "security@pes.co.ke",
    to: user.email,
    subject: "Reset Password Link",
    html: `
    <p>Dear ${user.name},</p>
    <p>We received a request to reset your password. If you did not request this change, please ignore this email.</p>
    <p>To reset your password, please follow the link below:</p>
    <p><a href="${resetPasswordUrl}">Reset Password</a></p>
    <p>If the link does not work, you can copy and paste the link into your web browser. The link will expire in 24 hours for security reasons.</p>
    <p>If you have any questions or concerns, please contact our support team</p>
    <p>Best regards,</p>
    <p>Movie Review Team</p>
    `,
  });

  res.json({ message: "Link Sent to your email!" });
};

exports.sendResetPasswordTokenStatus = (req, res) => {
  res.json({ valid: true });
};

/* This is the function that will be called when the user clicks on the link in the email. It will
check if the user exists in the database and if the token is valid. If it is, it will update the
user's isVerified field to true. */
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

/* This is the function that will be called when the user clicks on the link in the email. It will
check if the user exists in the database and if the token is valid. If it is, it will update the
user's isVerified field to true. */
exports.signIn = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return sendError(res, "Email/Password mismatch");

  const matched = await user.comparePassword(password);
  if (!matched) return sendError(res, "Email/Password mismatch");

  const { _id, name, role, isVerified } = user;

  const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

  res.json({
    user: { id: _id, name, email, role, token: jwtToken, isVerified },
  });
};

// const fs = require('fs');

// let template = fs.readFileSync('template.html', 'utf-8');
// template = template.replace('{{user.name}}', user.name);
// template = template.replace('{{resetPasswordUrl}}', resetPasswordUrl);

// transport.sendMail({
//     from: "security@pes.co.ke",
//     to: user.email,
//     subject: "Reset Password Link",
//     html: template,
//   });

{
  /* <p>Dear {{user.name}},</p>
<p>We received a request to reset your password. If you did not request this change, please ignore this email.</p>
<p>To reset your password, please follow the link below:</p>
<p><a href="{{resetPasswordUrl}}">Reset Password</a></p>
<p>If the link does not work, you can copy and paste the link into your web browser. The link will expire in 24 hours for security reasons.</p>
<p>If you have any questions or concerns, please contact our support team</p>
<p>Best regards,</p>
<p>Movie Review Team</p> */
}
