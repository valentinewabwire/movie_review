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

    const { breakpoints } = responsive_breakpoints[0];
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

exports.updateMovieWithoutPoster = async (req, res) => {
  const { movieId } = req.params;
  const movieIdFinal = movieId.trim().replace(/"/g, "");
  const objId = new mongoose.Types.ObjectId(movieIdFinal);
  if (!isValidObjectId(objId)) {
    return sendError(res, "Invalid Movie id!");
  }
  const movie = await Movie.findById(movieId);
  if (!movie) return sendError(res, "Movie not Found", 404);

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
  } = req.body;

  movie.title = title;
  movie.storyLine = storyLine;
  movie.tags = tags;
  movie.releaseDate = releaseDate;
  movie.status = status;
  movie.type = type;
  movie.genres = genres;
  movie.cast = cast;
  movie.trailer = trailer;
  movie.language = language;

  if (director) {
    const test = director.trim().replace(/"/g, "");
    const objId = new mongoose.Types.ObjectId(test);
    if (!isValidObjectId(objId)) {
      return sendError(res, "Invalid director id!");
    }
    movie.director = objId;
  }

  if (writers) {
    for (let writerId of writers) {
      if (!isValidObjectId(writerId))
        return sendError(res, "Invalid writer id!");
    }

    movie.writers = writers;
  }

  await movie.save();
  res.json({ message: "Movie is updated", movie });
};
exports.updateMovieWithPoster = async (req, res) => {
  const { movieId } = req.params;
  const movieIdFinal = movieId.trim().replace(/"/g, "");
  const objId = new mongoose.Types.ObjectId(movieIdFinal);
  if (!isValidObjectId(objId)) {
    return sendError(res, "Invalid Movie id!");
  }
  if (!req.file) return sendError(res, "Movie Poster is missing!");

  const movie = await Movie.findById(movieId);
  if (!movie) return sendError(res, "Movie not Found", 404);

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
  } = req.body;

  movie.title = title;
  movie.storyLine = storyLine;
  movie.tags = tags;
  movie.releaseDate = releaseDate;
  movie.status = status;
  movie.type = type;
  movie.genres = genres;
  movie.cast = cast;
  movie.trailer = trailer;
  movie.language = language;

  if (director) {
    const test = director.trim().replace(/"/g, "");
    const objId = new mongoose.Types.ObjectId(test);
    if (!isValidObjectId(objId)) {
      return sendError(res, "Invalid director id!");
    }
    movie.director = objId;
  }

  if (writers) {
    for (let writerId of writers) {
      if (!isValidObjectId(writerId))
        return sendError(res, "Invalid writer id!");
    }

    movie.writers = writers;
  }
  const posterID = movie.poster?.public_id;
  if (posterID) {
    const { result } = await cloudinary.uploader.destroy(posterID);
    if (result !== "ok") {
      return sendError(res, "Could not update poster at the moment!");
    }

    try {
      const {
        secure_url: url,
        public_id,
        responsive_breakpoints,
      } = await cloudinary.uploader.upload(req.file.path, {
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

      const { breakpoints } = responsive_breakpoints[0];
      if (breakpoints.length) {
        for (let imgObj of breakpoints) {
          const { secure_url } = imgObj;
          finalPoster.responsive.push(secure_url);
        }
      }

      movie.poster = finalPoster;

      // Success! The upload was completed and the returned values are stored in the variables.
    } catch (error) {
      // Error! Something went wrong during the upload process.
      return sendError(res, "Could not update poster at the moment!");
    }
  }

  await movie.save();
  res.json({ message: "Movie is updated", movie });
};

exports.removeMovie = async (req, res) => {
  const { movieId } = req.params;
  const movieIdFinal = movieId.trim().replace(/"/g, "");
  const objId = new mongoose.Types.ObjectId(movieIdFinal);
  if (!isValidObjectId(objId)) {
    return sendError(res, "Invalid Movie id!");
  }

  const movie = await Movie.findById(movieId);
  if (!movie) return sendError(res, "Movie not Found", 404);

  const posterId = movie.poster?.public_id;
  if (posterId) {
    const { result } = await cloudinary.uploader.destroy(posterId);
    if (result !== "ok") {
      return sendError(res, "Could not remove poster at the moment!");
    }
  }
  const trailerId = movie.trailer?.public_id;
  if (!trailerId) sendError(res, "Could not find trailer in the cloud");

  const { result } = await cloudinary.uploader.destroy(trailerId, {
    resource_type: "video",
  });
  if (result !== "ok") {
    return sendError(res, "Could not remove trailer at the moment!");
  }
  await Movie.findByIdAndDelete(movieId);

  res.json({ message: "movie removed successfully" });
};
