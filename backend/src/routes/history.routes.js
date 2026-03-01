const express = require("express");
const { getMyHistory, getAllHistory } = require("../controllers/history.controller");
const { requireAuth, requireAdmin } = require("../middleware/auth.middleware");

const router = express.Router();

// Employee
router.get("/my", requireAuth, getMyHistory);

// Admin
router.get("/all", requireAuth, requireAdmin, getAllHistory);

module.exports = router;
