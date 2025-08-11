const express = require("express");
const {
  addTask,
  editTask,
  deleteTask,
  markTaskCompleted,
  listTasks,
  reorderTasks,
} = require("../controllers/taskController.js");
const { AuthCheck } = require("../middleware/auth");
const router = express.Router();

// Add new task
router.post("/", AuthCheck, addTask);

// Edit task
router.put("/:id", AuthCheck, editTask);

// Delete task
router.delete("/:id", AuthCheck, deleteTask);

// Mark task as completed
router.patch("/:id/complete", AuthCheck, markTaskCompleted);

// List tasks (with filters)
router.get("/", AuthCheck, listTasks);

// Reorder tasks
router.patch("/reorder", AuthCheck, reorderTasks);

module.exports = router;