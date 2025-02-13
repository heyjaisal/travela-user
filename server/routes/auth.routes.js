const express = require("express");

const {
  sendOtp,
  verifyOtp,
  userlogin,
  getUser,
  updateprofile,
  logout,
} = require("../controllers/auth.controller");
const authorization = require("../middleware/authentication");
const router = express.Router();


router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/login", userlogin);
router.put("/profile", authorization, updateprofile);
router.get("/profile", authorization, getUser);
router.get("/logout",authorization,logout)

module.exports = router;
