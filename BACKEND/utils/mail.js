const nodemailer = require("nodemailer");
require("dotenv").config();
/* A function that generates a random number of length 6. */
exports.generateOTP = (otp_length = 6) => {
  let OTP = "";
  for (let i = 0; i < otp_length; i++) {
    const randomVal = Math.round(Math.random() * 9);
    OTP += randomVal;
  }
  return OTP;
};

/* Creating a transporter object for nodemailer. */
exports.generateMailTransporter = () =>
  nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS,
    },
  });
