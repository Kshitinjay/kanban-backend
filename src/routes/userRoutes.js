const express = require("express");
const User = require("../models/userScheme");

const userRoute = express.Router();

userRoute.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      success: true,
      message: "Users loaded successfully",
      data: users,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load users" });
  }
});

userRoute.get("/get-user/:id", async (req, res) => {
  try {
    const user = await User.findOne({ id: req.params.id });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({
      success: true,
      message: "User retrived successfully",
      data: user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load user" });
  }
});

userRoute.put("/update-user/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const isOwnProfile = req.user.id === id;
    const isAdmin = req.user.role === "admin";

    if (!isOwnProfile && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own profile",
      });
    }

    //khi se koi user ka role nhi update krde isliye ye lagay hai.
    delete req.body.role;
    const updatedUser = await User.findOneAndUpdate({ id }, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load user" });
  }
});

userRoute.put("/reset-password/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    const isOwnProfile = req.user.id === id;
    const isAdmin = req.user.role === "admin";

    if (!isOwnProfile && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You can only reset your own password",
      });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const user = await User.findOne({ id });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.password = password;
    await user.save();

    res.status(200).json({
      success: true,
      message: "User password updated successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update password" });
  }
});

userRoute.delete("/delete-user/:id", async (req, res) => {
  try {

    const isAdmin = req.user.role === "admin";

    if (!isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You cannot delete any user, only admin can.",
      });
    }

    const user = await User.findOneAndDelete({ id: req.params.id });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const users = await User.find();
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: users,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

module.exports = userRoute;
