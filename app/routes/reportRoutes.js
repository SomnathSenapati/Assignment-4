const express = require("express");
const {
  dailySummary,
  weeklySummary,
  taskStatistics,
} = require("../controllers/reportController");
const { AuthCheck } = require("../middleware/auth");

const router = express.Router();

// Daily summary
router.get("/daily", AuthCheck, dailySummary);

// Weekly summary
router.get("/weekly", AuthCheck, weeklySummary);

// Task statistics
router.get("/stats", AuthCheck, taskStatistics);

module.exports = router;
