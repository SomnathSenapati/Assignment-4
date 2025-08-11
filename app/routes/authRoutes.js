const express = require("express");
const { signup, verifyEmail, login } = require("../controllers/authController");

const router = express.Router();

// User signup with email verification
router.post("/signup", signup);

// Email verification
router.get("/verify", verifyEmail);

// Login
router.post("/login", login);

module.exports = router;
