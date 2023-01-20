const mongoose = require("mongoose");

mongoose
  .connect("mongodb://127.0.0.1:27017/review_app")
  .then(() => {
    console.log("DB is Connected");
  })
  .catch((ex) => {
    console.log("db connection failed: ", ex);
  });
