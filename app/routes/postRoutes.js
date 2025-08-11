const express = require("express");
const {
  addBlog,
  editBlog,
  deletePost,
  listPosts,
} = require("../controllers/blogController");
const { AuthCheck } = require("../middleware/auth");

const router = express.Router();

// Add Blog
router.post("/", AuthCheck, addBlog);

// Edit Blog
router.put("/:id", AuthCheck, editBlog);

// Delete Blog
router.delete("/:id", AuthCheck, deletePost);

// List blog
router.get("/", AuthCheck, listPosts);

module.exports = router;
