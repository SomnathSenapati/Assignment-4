const express = require("express");
const {
  setReminder,
  editReminder,
  deleteReminder,
} = require("../controllers/reminderController");
const { AuthCheck } = require("../middleware/auth");

const router = express.Router();

// Set reminder
router.post("/", AuthCheck, setReminder);

// Edit reminder
router.put("/:id", AuthCheck, editReminder);

// Delete reminder
router.delete("/:id", AuthCheck, deleteReminder);

module.exports = router;
