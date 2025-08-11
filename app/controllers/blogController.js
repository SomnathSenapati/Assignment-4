const Post = require("../models/Post");

// Create Blog Post
const addBlog = async (req, res) => {
  try {
    const { title, content, categoryId, tags } = req.body;

    if (!title || !content || !categoryId) {
      return res
        .status(400)
        .json({ message: "Title, content, and category are required" });
    }

    const blogExists = await Post.findOne({ title, authorId: req.user.id });
    if (blogExists) {
      return res.status(400).json({ message: "Blog already exists" });
    }

    const post = await Post.create({
      title,
      content,
      categoryId,
      tags: tags || [],
      authorId: req.user.id,
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Edit Blog Post
const editBlog = async (req, res) => {
  try {
    const { title, content, categoryId, tags } = req.body;

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.authorId.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    post.title = title || post.title;
    post.content = content || post.content;
    post.categoryId = categoryId || post.categoryId;
    post.tags = tags || post.tags;

    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Blog Post
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.authorId.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await post.deleteOne();
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// List All Blog Posts for Current User
const listPosts = async (req, res) => {
  try {
    const posts = await Post.find({ authorId: req.user.id }).populate(
      "categoryId",
      "name"
    );
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addBlog,
  editBlog,
  deletePost,
  listPosts,
};
