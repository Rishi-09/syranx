import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();
console.log("auth route trigerred");
const JWT_SECRET = process.env.JWT_SECRET;

router.post("/signup", async (req, res) => {
  console.log("signup route trigerred");
  try {
    const { userName, email, password } = req.body;
    console.log("processing signup request");

    const existing = await User.findOne({ email });
    if (existing) {
      console.log("Email already exists");
      return res.status(400).json({ error: "Email already exists" });
    }
    const hashed = await bcrypt.hash(password, 10);

    const createdUser = await User.create({
      userName,
      email,
      password: hashed,
    });
    console.log("user creaed")

    const safeUser = {
      _id: createdUser._id,
      userName: createdUser.userName,
      email: createdUser.email,
    };

    res.status(201).json(safeUser);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Signup failed" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ error: "Invalid email or password" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ error: "Invalid email or password" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    res.json({
      token,
      user: {
        _id: user._id,
        userName: user.userName,
        email: user.email,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Login failed" });
  }
});

export default router;
