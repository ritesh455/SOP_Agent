const mongoose = require("mongoose");

const chatHistorySchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true
  },

  question: {
    type: String,
    required: true
  },

  answer: {
    type: String,
    required: true
  },

  askedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("ChatHistory", chatHistorySchema);
