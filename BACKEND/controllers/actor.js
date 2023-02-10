const { isValidObjectId } = require("mongoose");
const Actor = require("../models/actor");
const { sendError } = require("../utils/helper");
const cloudinary = require("cloudinary").v2;

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_API_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

/* Creating a new actor. */
exports.createActor = async (req, res) => {
  const { name, about, gender } = req.body;
  const { file } = req;
  const newActor = new Actor({ name, about, gender });

  /* Uploading the image to cloudinary and saving the url and public_id to the database. */
  if (file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      file.path,
      { gravity: "face", height: 500, width: 500, crop: "thumb" }
    );
    newActor.avatar = { url: secure_url, public_id };
  }

  /* This is saving the new actor to the database and then returning the new actor's information. for front end purposes */
  await newActor.save();
  res.status(201).json({
    id: newActor._d,
    name,
    about,
    gender,
    avatar: newActor.avatar?.url,
  });
};

/* The updateActor code is updating the actor. */
exports.updateActor = async (req, res) => {
  const { name, about, gender } = req.body;
  const { file } = req;
  const { actorId } = req.params;

  /* This is checking if the actorId is valid and if it is not valid it will return an error. */
  if (!isValidObjectId(actorId)) return sendError(res, "Invalid Request!");
  const actor = await Actor.findById(actorId);

  if (!actor) return sendError(res, "Invalid Request, Record not Found");

  const public_id = actor.avatar?.public_id;

  if (public_id && file) {
    const { result } = await cloudinary.uploader.destroy(public_id);

    if (result !== "ok")
      return sendError(res, "Could not remove image from cloud!");
  }

  /* This is uploading the image to cloudinary and saving the url and public_id to the database. */
  if (file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      file.path,
      { gravity: "face", height: 500, width: 500, crop: "thumb" }
    );
    actor.avatar = { url: secure_url, public_id };
  }
  /* This is updating the actor's information. */
  actor.name = name;
  actor.about = about;
  actor.gender = gender;

  await actor.save();
  res.status(201).json({
    id: actor._d,
    name,
    about,
    gender,
    avatar: actor.avatar?.url,
  });
};

/* removeActor is removing an actor from the database. */
exports.removeActor = async (req, res) => {
  const { actorId } = req.params;

  /* This is checking if the actorId is valid and if it is not valid it will return an error. */
  if (!isValidObjectId(actorId)) return sendError(res, "Invalid Request!");
  const actor = await Actor.findById(actorId);

  if (!actor) return sendError(res, "Invalid Request, Record not Found");

  const public_id = actor.avatar?.public_id;

  if (public_id) {
    const { result } = await cloudinary.uploader.destroy(public_id);

    if (result !== "ok")
      return sendError(res, "Could not remove image from cloud!");
  }

  await Actor.findByIdAndDelete(actorId);
  res.json({ message: "Record removed successfully." });
};

/* This is a function that is searching for an actor by name. */
exports.searchActor = async (req, res) => {
  const { query } = req;
  query.name;
  const result = await Actor.find({ $text: { $search: `"${query.name}"` } });
  res.json(result);
};

/* This is a function that is getting the latest actors. */
exports.getLatestActors = async (req, res) => {
  const result = await Actor.find().sort({ createdAt: "-1" }).limit(12);
  res.json(result);
};

exports.getSingleActor = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) return sendError(res, "Invalid Request!");
  const actor = await Actor.findById(id);
  if (!isValidObjectId(actor))
    return sendError(res, "Invalid Request,actor not found", 404);
  res.json(actor);
};
