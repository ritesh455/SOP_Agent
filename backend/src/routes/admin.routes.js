const express = require("express");
const { addEmployee } = require("../controllers/admin.controller");
const { requireAuth, requireAdmin } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/users", requireAuth, requireAdmin, addEmployee);

module.exports = router;
