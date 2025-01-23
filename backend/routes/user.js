const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth.js");
const User = require("../models/user.model");
const { getUserClickAnalytics } = require("../utils/analytics");

router.post("/register", async (req, res) => {
  const { name, email, password, mobileNo, confirmPassword } = req.body;

  if (
    !name ||
    !email ||
    !password ||
    !mobileNo ||
    !confirmPassword ||
    password !== confirmPassword
  ) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required!" });
  }

  try {
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }
    const hashedPass = await bcrypt.hash(password, 10);
    const newUser = new User({
      name: name,
      email: email,
      password: hashedPass,
      mobileNo: mobileNo,
    });
    await newUser.save();

    res
      .status(200)
      .json({ success: true, message: "User Registed Succesfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error !!" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required!" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Email or Password" });
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Email or Password" });
    }
    const payload = { id: user._id, name: user.name };
    const token = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: "24h",
    });

    const { password: hashedPass, ...userDetails } = user._doc;
    res.status(200).json({
      success: true,
      message: "Login Successfull",
      token: token,
      user: userDetails,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: "Error", message: "Internal Server Error !!" });
  }
});

router.put("/update", auth, async (req, res) => {
  const { newName, newEmail, newMobileNo } = req.body;
  if (!newName || !newEmail || !newMobileNo) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }
  try {
    const user = await User.findOne({ _id: req.user.id });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid User" });
    }
    await User.findByIdAndUpdate(req.user.id, {
      name: newName,
      email: newEmail,
      mobileNo: newMobileNo,
    });
    res
      .status(200)
      .json({ success: true, message: "User Updated Successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: "Error", message: "Internal Server Error !!" });
  }
});

router.delete("/delete", auth, async (req, res) => {
  const id = req.user.id;
  try {
    const user = await User.findByIdAndDelete(req.user.id);
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid User" });
    }
    return res
      .status(200)
      .json({ success: true, message: "User Deleted Succesfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: "Error", message: "Internal Server Error !!" });
  }
});

router.get("/dashboard", auth, async (req, res) => {
  const userId = req.user.id;
  try {
    const user = await User.findById({ _id: userId });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid User" });
    }
    // console.log(userId);
    const analytics = await getUserClickAnalytics(userId);
    const dateWiseClicks = analytics.dateWiseClicks;
    const deviceTypeClicks = analytics.deviceTypeClicks;
    const totalClicks = analytics.totalClicks;
    res.status(200).json({
      status: true,
      message: "Analytics fetched successfully!",
      data: { dateWiseClicks, deviceTypeClicks, totalClicks },
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: "Error", message: "Internal Server Error !!" });
  }
});

module.exports = router;
