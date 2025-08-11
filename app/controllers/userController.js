const User = require("../models/User");

// Get logged-in user's profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Get profile error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Update logged-in user's profile
const updateProfile = async (req, res) => {
  try {
    const { name } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { name },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error("Update profile error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getProfile,
  updateProfile,
};
