const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const userRoutes = require("./routes/user");
const linkRoutes = require("./routes/link");

dotenv.config({});

const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.status(200).send({ status: "success", msg: "API is working well." });
});
app.use("/user", userRoutes);
app.use("/link", linkRoutes);

app.listen(port, () => {
  console.log(`listening on port ${port}`);
  mongoose
    .connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => {
      console.log(err);
    });
});
