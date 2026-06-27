const mongoose = require("mongoose");

// Reads the connection string from the MONGODB_URI env variable (set on the
// host / in .env). Falls back to local MongoDB for development.
const databaseURL =
  process.env.MONGODB_URI || "mongodb://localhost:27017/kanban-backend";

mongoose
  .connect(databaseURL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("Connection failed:", err));

const dbConnection = mongoose.connection;

dbConnection.on("connected", () => {
  console.log("Connected to MongoDb server");
});

dbConnection.on("error", (err) => {
  console.error("MongoDb connection error:", err);
});

dbConnection.on("disconnected", () => {
  console.log("MongoDb server disconnected");
});

module.exports = dbConnection;
