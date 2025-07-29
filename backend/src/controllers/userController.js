import User from "../models/User.js";
import jwt from "jsonwebtoken";
import fs from "fs";
import pdfParse from "pdf-parse";

const generateToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: "Email already exists" });

  const user = await User.create({ name, email, password });
  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id),
  });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id),
  });
};

export const getProfile = async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json(user);
};

export const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password; // bcrypt will hash if set up in schema
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

export const uploadResume = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const pdfBuffer = fs.readFileSync(req.file.path);

    const parsed = await pdfParse(pdfBuffer);
    user.resumeText = parsed.text;
    user.resumeFile = req.file.filename;

    await user.save();

    res.json({
      message: "Resume uploaded successfully",
      resumeFile: req.file.filename,
      resumeTextPreview: parsed.text.slice(0, 300) + "...",
    });
  } catch (error) {
    console.error("Resume upload failed:", error);
    res.status(500).json({ message: "Failed to upload resume" });
  }
};
