const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.signup = async (req, res) => {
  const { firstName, lastName, email, password } = req.body; // use snake_case
  try {
    const user = await User.create({ firstName, lastName, email, password });
    res.status(201).json({ user: { id: user._id, email } });
  } catch (error) {
    if (error.code === 11000)
      return res.status(400).json({ message: "Email already exists" });
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};
