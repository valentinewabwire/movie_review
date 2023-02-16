const express = require("express");
require("express-async-errors");
require("./db");
require("dotenv").config();
const { create } = require("./controllers/user");
const { errorHandler } = require("./middlewares/error");
const cors = require("cors");
const userRouter = require("./routes/user");
const actorRouter = require("./routes/actor");
const movieRouter = require("./routes/movie");
const { handleNotFound } = require("./utils/helper");
const port = 8500;
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/user", userRouter);
app.use("/api/actor", actorRouter);
app.use("/api/movie", movieRouter);

app.use("/*", handleNotFound);

app.get(
  "/about",
  (req, res, next) => {
    next();
  },
  (req, res) => {
    res.send("<h2>About page</h2>");
  }
);
app.use(errorHandler);
// app.post("/user-create", create);

/* Listening to the port and logging the message to the console. */
app.listen(port, () => {
  console.log("App running on port " + port);
});
