const express = require("express");
const dbConnection = require("./src/config/dbConnection");
const app = express();
const ticketRoutes = require("./src/routes/ticketRoutes");

app.use(express.json());

app.get("/", (req, res) => {
  res.send("kanban backend server setup");
});

app.use("/tickets", ticketRoutes);

app.listen(3000, () => {
  console.log("Server started");
});
