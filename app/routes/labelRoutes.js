const express = require("express");
const { addLabel, listLabels } = require("../controllers/labelController.js");
const { AuthCheck } = require("../middleware/auth");

const router = express.Router();

// Add label
router.post("/", AuthCheck, addLabel);

// List labels
router.get("/", AuthCheck, listLabels);

module.exports = router;
