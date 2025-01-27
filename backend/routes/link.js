const express = require("express");
const auth = require("../middleware/auth.js");
const router = express.Router();
const crypto = require("crypto");
const User = require("../models/user.model");
const VisitLog = require("../models/visitLogs.model");
const Link = require("../models/link.model");

router.post("/create", auth, async (req, res) => {  
  const id = req.user.id;
  if (!id) {
    return res.status(400).json({ status: false, message: "user not found !" });
  }
  const { originalLink, remarks, expirationDate } = req.body;
  try {
    // const user = await User.findOne(id);
    const newexpirationDate = expirationDate ? new Date(expirationDate) : null;
    
    const shortLink = crypto
      .createHash("sha256")
      .update(originalLink)
      .digest("hex")
      .slice(0, 10);

    const newLink = new Link({
      userId: id,
      originalLink: originalLink,
      remarks: remarks,
      expirationDate: newexpirationDate,
      shortLink: shortLink,
    });
    await newLink.save();
    return res.status(200).json({
      status: true,
      message: "Link Created Succesfully !!",
      newLink: newLink,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: false, message: "Internal Server Error" });
  }
});

router.patch("/update/:id", auth, async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ status: false, message: "link not found !" });
  }
  const { newOriginalLink, newRemarks, newExpirationDate } = req.body;
  try {
    if (!newOriginalLink || !newRemarks || !newExpirationDate) {
      return res
        .status(400)
        .json({ status: false, message: "All fields are Required!!" });
    }

    const expirationDate = newExpirationDate
      ? new Date(newExpirationDate)
      : null;

    const link = await Link.findByIdAndUpdate(
      id,
      {
        originalLink: newOriginalLink,
        remarks: newRemarks,
        expirationDate: expirationDate,
      },
      {
        new: true, // Return the updated document
        runValidators: true, // Run schema validators
      }
    );
    if (!link) {
      return res
        .status(404)
        .json({ status: false, message: "Link not found !" });
    }
    return res.status(200).json({
      status: true,
      message: "Link Updated Succesfully !!",
      link: link,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: false, message: "Internal Server Error" });
  }
});

router.get("/everylink", auth, async (req, res) => {
  const userId = req.user.id;
  //   console.log(userId);
  if (!userId) {
    return res.status(400).json({ status: false, message: "User Not Found!" });
  }
  const links = await Link.find({ userId: userId });
  //   console.log(links);
  if (!links) {
    return res.status(400).json({ status: false, message: "Link Not Found!" });
  }
  return res
    .status(200)
    .json({ status: true, message: "Links found !", links: links });
});

router.post("/visit", async (req, res) => {
  const { shortlink, originalLink, deviceType, platform, ipAddress } = req.body;
  try {
    const visit = new VisitLog({
      shortLink: shortlink,
      originalLink: originalLink,
      deviceType: deviceType,
      platform: platform,
      ipAddress: ipAddress,
      // userId: userId,
    });
    const updatedLink = await Link.findOneAndUpdate(
      { shortLink: shortlink }, // Find the link by shortLink
      { $inc: { clicks: 1 } }, // Increment the clicks count by 1
      { new: true } // Return the updated document
    );

    if (!updatedLink) {
      return res.status(404).json({
        status: false,
        message: "Short link not found in the database!",
      });
    }
    await visit.save();

    return res.status(200).json({
      status: true,
      message: "Visit logged and clicks count updated successfully!",
      updatedLink,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: false, message: "Internal Server Error" });
  }
});

module.exports = router;
