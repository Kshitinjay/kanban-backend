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
    const ticket = await Ticket.create(req.body);

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

ticketRoutes.delete("/delete-ticket/:id", async (req, res) => {
  try {
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

module.exports = ticketRoutes;
