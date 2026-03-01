const express = require("express");
const { requireAuth } = require("../middleware/auth.middleware");
const { askQuestion, streamQuestion } = require("../controllers/chat.controller");
const router = express.Router();


router.post("/ask", requireAuth, askQuestion);
router.get("/stream", requireAuth, streamQuestion);
module.exports = router;
