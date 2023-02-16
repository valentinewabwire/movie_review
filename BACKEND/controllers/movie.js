const { sendError } = require("../utils/helper");
const cloudinary = require("../cloud");
const Movie = require("../models/movie");
const { isValidObjectId } = require("mongoose");
const mongoose = require("mongoose");
const validator = require("validator");

exports.uploadTrailer = async (req, res) => {
  const { file } = req;
  if (!file) return sendError(res, "video file is missing!");

  const { secure_url: url, public_id } = await cloudinary.uploader.upload(
    file.path,
    {
      resource_type: "video",
    }
  );
  res.status(201).json({ url, public_id });
};

exports.createMovie = async (req, res) => {
  const { file, body } = req;

  const {
    title,
    storyLine,
    director,
    releaseDate,
    status,
    type,
    genres,
    tags,
    cast,
    writers,
    trailer,
    language,
  } = body;

  const newMovie = new Movie({
    title,
    storyLine,
    releaseDate,
    status,
    type,
    genres,
    tags,
    cast,
    trailer,
    language,
  });

  if (director) {
    const test = director.trim().replace(/"/g, "");
    const objId = new mongoose.Types.ObjectId(test);
    if (!isValidObjectId(objId)) {
      return sendError(res, "Invalid director id!");
    }
    newMovie.director = objId;
  }

  if (writers) {
    for (let writerId of writers) {
      if (!isValidObjectId(writerId))
        return sendError(res, "Invalid writer id!");
    }

    newMovie.writers = writers;
  }
  //uploading poster
  //   const {
  //     secure_url: url,
  //     public_id,
  //     responsive_breakpoints,
  //   } = await cloudinary.uploader.upload(file.path, {
  //     transformation: {
  //       width: 1280,
  //       height: 720,
  //     },
  //     responsive_breakpoints: {
  //       create_derived: true,
  //       max_width: 640,
  //       max_images: 3,
  //     },
  //   });

  console.log(tags);

  try {
    const {
      secure_url: url,
      public_id,
      responsive_breakpoints,
    } = await cloudinary.uploader.upload(file.path, {
      transformation: {
        width: 1280,
        height: 720,
      },
      responsive_breakpoints: {
        create_derived: true,
        max_width: 640,
        max_images: 3,
      },
    });
    const finalPoster = { url, public_id, responsive: [] };

    const breakpoints = responsive_breakpoints[0];
    if (breakpoints.length) {
      for (let imgObj of breakpoints) {
        const { secure_url } = imgObj;
        finalPoster.responsive.push(secure_url);
      }
    }

    newMovie.poster = finalPoster;

    // Success! The upload was completed and the returned values are stored in the variables.
  } catch (error) {
    // Error! Something went wrong during the upload process.
    console.error(error);
  }

  await newMovie.save();
  res.status(201).json({
    id: newMovie._id,
    title,
  });
};
