const ChatHistory = require("../models/chatHistory.model");

// Employee: own history
const getMyHistory = async (req, res) => {
  try {
    const history = await ChatHistory.find({
      employeeId: req.user.employeeId
    }).sort({ askedAt: -1 });

    res.json(history);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: all history
const getAllHistory = async (req, res) => {
  try {
    const history = await ChatHistory.find()
      .sort({ askedAt: -1 });

    res.json(history);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getMyHistory, getAllHistory };
