const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const userRoutes = require("./routes/user");
const linkRoutes = require("./routes/link");
const useragent = require("express-useragent");
const Link = require("./models/link.model");
const VisitLog = require("./models/visitLogs.model");

dotenv.config({});

const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res
    .status(200)
    .send({ status: "success", msg: "Mini Link API's is working well." });
});
app.use("/user", userRoutes);
app.use("/link", linkRoutes);
app.use(useragent.express());

app.get("/visit/:shortLink", async (req, res) => {
  const shortLink = req.params.shortLink; // Extract short link from URL
  const userAgent = req.useragent; // Extract user-agent info

  try {
    // Find the link in the database
    const link = await Link.findOne({ shortLink: shortLink });
    if (!link) {
      return res.status(404).send("Short link not found!");
    }
    // Extract user info
    const deviceType = userAgent.isMobile
      ? "Mobile"
      : userAgent.isTablet
      ? "Tablet"
      : userAgent.isDesktop
      ? "Desktop"
      : "Mobile";
    // const platform = userAgent.platform;
    const platform = userAgent.isWindows
      ? "Windows"
      : userAgent.isMac
      ? "iOS"
      : userAgent.isiPhone
      ? "iOS"
      : userAgent.isiPad
      ? "iOS"
      : userAgent.isChrome
      ? "Chrome"
      : userAgent.isAndroid
      ? "Android"
      : "Android";
    const ipAddress =
      req.headers["x-forwarded-for"] || req.socket.remoteAddress; // IP Address
    const timestamp = new Date(); // Current timestamp

    const currentStatus =
      timestamp < link.expirationDate ? "Active" : "Inactive";
    if (link.status !== currentStatus) {
      link.status = currentStatus;
      await link.save();
    }

    if (!(timestamp < link.expirationDate)) {
      res.send(
        `<html>
          <head>
            <script>
              setTimeout(() => {
                window.location.href = "https://google.com";
              }, 2000); // Redirect after 2 seconds
            </script>
          </head>
          <body>
            <h1>Link Inactive....Opening Google</h1>
          </body>
        </html>`
      );
    } else {
      // Update the click count for the link
      await Link.updateOne(
        { shortLink },
        { $inc: { clicks: 1 } } // Increment the click count
      );

      // Log the visit in the VisitLog schema
      const visitLog = new VisitLog({
        shortLink: link.shortLink,
        originalLink: link.originalLink,
        deviceType: deviceType,
        platform: platform,
        ipAddress: ipAddress,
        timestamp: timestamp,
      });
      await visitLog.save();

      res.redirect(link.originalLink);
    }
    // Respond with a message and redirect
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error!");
  }
});

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
