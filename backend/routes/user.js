const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
router.post("/register", async (req, res) => {
  const { name, email, password, mobileNo } = req.body;
  try {
    const user = new User({ name, email, password, mobileNo });
    await user.save();
    res
      .status(200)
      .json({ success: "true", message: "User Registed Succesfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error !!" });
  }
});

module.exports = router;
