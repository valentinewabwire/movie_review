/* The below code is creating a schema for the user model. */
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

/* Creating a schema for the user model. */
const userSchema = mongoose.Schema({
  name: { type: String, trim: true, required: true },
  email: { type: String, trim: true, required: true, unique: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, required: true, default: false },
  role: {
    type: String,
    required: true,
    default: "user",
    enum: ["admin", "user"],
  },
});

/* This is a middleware that is run before the user is saved to the database. It checks if the password
has been modified and if it has, it hashes the password. */
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.comparePassword = async function (password) {
  const result = await bcrypt.compare(password, this.password);
  return result;
};
module.exports = mongoose.model("User", userSchema);
