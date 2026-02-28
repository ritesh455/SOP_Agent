const bcrypt = require("bcryptjs");
const Employee = require("../models/employee.model");

const addEmployee = async (req, res) => {
  try {
    const { employeeId, name, email, password } = req.body;

    if (!employeeId || !password) {
      return res.status(400).json({ message: "Employee ID and password are required" });
    }

    const existingEmployee = await Employee.findOne({ employeeId });
    if (existingEmployee) {
      return res.status(400).json({ message: "Employee already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const employee = await Employee.create({
      employeeId,
      name,
      email,
      passwordHash,
      active: true
    });

    res.status(201).json({
      success: true,
      message: "Employee added successfully",
      employee: {
        employeeId: employee.employeeId,
        name: employee.name,
        email: employee.email
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addEmployee };
    