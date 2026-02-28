const express = require("express");
const cors = require("cors");

const documentRoutes = require("./routes/document.routes");
const chatRoutes = require("./routes/chat.routes");
const authRoutes = require("./routes/auth.routes");
const historyRoutes = require("./routes/history.routes");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/chat", chatRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/admin", require("./routes/admin.routes"));

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "OpsMind AI backend is running"
  });
});

module.exports = app;
