const jwt = require("jsonwebtoken");

const requireAuth = (req, res, next) => {
  // 1️⃣ Try Authorization header
  let token = null;
  console.log("AUTH USER:", req.user);

  if (req.headers.authorization) {
    token = req.headers.authorization.split(" ")[1];
  }

  // 2️⃣ Fallback: token from query (for SSE)
  if (!token && req.query.token) {
    token = req.query.token;
  }

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

const requireAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};

module.exports = { requireAuth, requireAdmin };
