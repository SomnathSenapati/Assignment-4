// controllers/categoryController.js (CommonJS)
const Category = require("../models/Category");

const addCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const categoryExists = await Category.findOne({ name, user: req.user.id });
    if (categoryExists) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const category = await Category.create({ name, user: req.user.id });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const editCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    if (category.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    category.name = name || category.name;
    const updatedCategory = await category.save();

    res.json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    if (category.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await category.deleteOne();
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const listCategories = async (req, res) => {
  try {
    const categories = await Category.find({ user: req.user.id });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addCategory,
  editCategory,
  deleteCategory,
  listCategories,
};
