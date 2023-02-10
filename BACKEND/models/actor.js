const mongoose = require("mongoose");
/* This is creating a schema for the actor model. */
const actorSchema = mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    about: { type: String, trim: true, required: true },
    gender: { type: String, trim: true, required: true },
    avatar: { type: Object, url: String, public_id: String },
  },
  { timestamps: true }
);

actorSchema.index({ name: "text" });
module.exports = mongoose.model("Actor", actorSchema);
