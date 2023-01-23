const nodemailer = require("nodemailer");
const User = require("../models/user");
const EmailVerificationToken = require("../models/emailVerificationToken");
const { isValidObjectId } = require("mongoose");
const { generateOTP, generateMailTransporter } = require("../../utils/mail");
const { sendError } = require("../../utils/helper");

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

  const isMatched = await token.compaireToken(OTP);
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
