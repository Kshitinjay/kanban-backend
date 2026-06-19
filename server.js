require("dotenv").config();
const express = require("express");
const cors = require("cors");

const dbConnection = require("./src/config/dbConnection");
const ticketRoutes = require("./src/routes/ticketRoutes");
const userRoute = require("./src/routes/userRoutes");
const authRoute = require("./src/routes/authRoutes");
const auth = require("./src/middleware/auth");

const app = express();

app.use(cors({origin: process.env.CLIENT_URL || "http://localhost:5173",}),);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("kanban backend server setup");
});

app.use("/", authRoute);
app.use("/users", auth, userRoute);
app.use("/tickets", auth, ticketRoutes);

app.listen(3000, () => {
  console.log("Server started");
});
