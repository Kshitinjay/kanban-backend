const express = require("express");
const Ticket = require("../models/ticketSchema");
const ticketRoutes = express.Router();

ticketRoutes.get("/", async (req, res) => {
  try {
    const tickets = await Ticket.find();
    res.status(201).json({
      success: true,
      message: "Tickets loaded successfully",
      data: tickets,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load tickets" });
  }
});

ticketRoutes.get("/get-ticket/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const ticket = await Ticket.findOne({ id });
    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }
    res.status(200).json({
      success: true,
      message: "Ticket retrived successfully",
      data: ticket,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load tickets" });
  }
});

ticketRoutes.post("/add-ticket", async (req, res) => {
  try {
    const { title, description, status, priority, assignee, assigneeId } =
      req.body;

    const ticket = await Ticket.create({
      title,
      description,
      status,
      priority,
      assignee,
      assigneeId,
      reporter: req.user.name,
      reporterId: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Ticket created successfully",
      data: ticket,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Failed to create ticket",
      error: err.message,
    });
  }
});

ticketRoutes.put("/update-ticket/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const ticket = await Ticket.findOne({ id });
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    const isAdmin = req.user.role === "admin";
    const isAssignee = ticket.assigneeId === req.user.id;
    if (!isAdmin && !isAssignee) {
      return res.status(403).json({
        success: false,
        message: "You can only edit tickets assigned to you",
      });
    }


    const { title, description, status, priority, assignee, assigneeId } = req.body;
    const updatedTicket = await Ticket.findOneAndUpdate(
      { id },
      { title, description, status, priority, assignee, assigneeId },
      { new: true, runValidators: true },
    );

    res.status(200).json({
      success: true,
      message: "Ticket updated successfully",
      data: updatedTicket,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Failed to update ticket",
      error: err.message,
    });
  }
});

ticketRoutes.delete("/delete-ticket/:id", async (req, res) => {
  try {
    const isAdmin = req.user.role === "admin";

    if (!isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You cannot delete any ticket, only admin can.",
      });
    }

    const id = req.params.id;
    const ticket = await Ticket.findOneAndDelete({ id });
    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }
    res.status(200).json({
      success: true,
      message: "Ticket deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load tickets" });
  }
});

ticketRoutes.put("/add-comment/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Comment text is required",
      });
    }

    const ticket = await Ticket.findOne({ id });
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    ticket.comments.push({
      text,
      userId: req.user.id,
      author: req.user.name,
    });
    await ticket.save();

    res.status(201).json({
      success: true,
      message: "Comment added successfully",
      data: ticket.comments,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add comment" });
  }
});


module.exports = ticketRoutes;
