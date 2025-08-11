const express = require("express");
const { getProfile, updateProfile } = require("../controllers/userController");
const { AuthCheck } = require("../middleware/auth");

const router = express.Router();

router.get("/me", AuthCheck, getProfile);
router.put("/me", AuthCheck, updateProfile);

module.exports = router;