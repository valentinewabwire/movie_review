const express = require("express");
require("./db");
const { create } = require("./controllers/user");
const userRouter = require("./routes/user");
const port = 8500;
const app = express();

app.use(express.json());
app.use("/api/user", userRouter);

app.get("/about", (req, res) => {
  res.send("<h2>About page</h2>");
});
// app.post("/user-create", create);

/* Listening to the port and logging the message to the console. */
app.listen(port, () => {
  console.log("App running on port " + port);
});
