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

userRoute.post("/add-user", async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user,
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

module.exports = userRoute;
