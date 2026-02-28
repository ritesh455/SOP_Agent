const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Employee = require("../models/employee.model");
const Admin = require("../models/admin.model");

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password required" });
    }

    // Check Admin
    let user = await Admin.findOne({ username });
    let role = "admin";

    // If not admin, check employee
    if (!user) {
      user = await Employee.findOne({ employeeId: username, active: true });
      role = "employee";
    }

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role,
        employeeId: user.employeeId || null
      },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({
      token,
      role
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { login };
