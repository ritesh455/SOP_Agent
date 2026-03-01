const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true,
    unique: true
  },
  name: String,
  email: String,

  passwordHash: {
    type: String,
    required: true
  },

  role: {
    type: String,
    default: "employee"
  },

  active: {
    type: Boolean,
    default: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Employee", employeeSchema);
