require("dotenv").config();
const express = require("express");
const cors = require("cors");

const dbConnection = require("./src/config/dbConnection");
const ticketRoutes = require("./src/routes/ticketRoutes");
const userRoute = require("./src/routes/userRoutes");
const authRoute = require("./src/routes/authRoutes");
const auth = require("./src/middleware/auth");

const app = express();

// Local dev + deployed frontend dono allow karo.
const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({ origin: allowedOrigins }));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("kanban backend server setup");
});

app.use("/", authRoute);
app.use("/users", auth, userRoute);
app.use("/tickets", auth, ticketRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
