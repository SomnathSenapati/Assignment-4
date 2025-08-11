const express = require("express");
const {
  addCategory,
  editCategory,
  deleteCategory,
  listCategories,
} = require("../controllers/categoryController");
const { AuthCheck } = require("../middleware/auth");

const router = express.Router();

// Add category
router.post("/", AuthCheck, addCategory);

// Edit category
router.put("/:id", AuthCheck, editCategory);

// Delete category
router.delete("/:id", AuthCheck, deleteCategory);

// List categories
router.get("/", AuthCheck, listCategories);

module.exports = router;
