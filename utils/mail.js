/* A function that generates a random number of length 6. */
exports.generateOTP = (otp_length = 6) => {
  let OTP = "";
  for (let i = 1; i < otp_length; i++) {
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
      user: "08d9a405d9190e",
      pass: "91b7e5ab5d1de7",
    },
  });
