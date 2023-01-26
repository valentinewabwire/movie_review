/* Connecting to the database. */
const mongoose = require("mongoose");
require("dotenv").config();
const url = process.env.MONGO_URL;

console.log(url);

mongoose
  .connect(url)
  .then(() => {
    console.log("DB is Connected");
  })
  .catch((ex) => {
    console.log("db connection failed: ", ex);
  });
