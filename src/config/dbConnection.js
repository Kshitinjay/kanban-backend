const mongoose = require("mongoose");

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
