const mongoose = require("mongoose");
exports.parseData = (req, res, next) => {
  const { trailer, cast, genres, tags, writers } = req.body;

  console.log(JSON.parse(tags));

  if (trailer) req.body.trailer = JSON.parse(trailer);
  if (cast) {
    try {
      const parsedCast = JSON.parse(cast);
      // Check and convert the "id" field of each cast object to a valid ObjectId
      for (const castObj of parsedCast) {
        if (typeof castObj.id === "string" && castObj.id.length === 24) {
          castObj.id = mongoose.Types.ObjectId.createFromHexString(castObj.id);
        } else {
          throw new Error("Invalid cast id inside cast!!");
        }
      }

      req.body.cast = parsedCast;
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }

    // req.body.cast = JSON.parse(cast);
  }
  if (genres) req.body.genres = JSON.parse(genres);
  if (tags) req.body.tags = JSON.parse(tags);
  console.log("tags");
  if (writers) req.body.writers = JSON.parse(writers);

  next();
};
