const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  version: { type: Number, default: 1 },
  status: { type: String, default: "active" },
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Document", documentSchema);
