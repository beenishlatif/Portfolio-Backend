import jwt from "jsonwebtoken";
import slugify from "slugify";
import User from "../models/User.js";
import Portfolio from "../models/Portfolio.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// @route POST /api/auth/register
export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please provide name, email and password" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "An account with this email already exists" });
    }

    const RESERVED_SLUGS = ["admin", "login", "register", "dashboard", "api"];
    let baseSlug = slugify(name, { lower: true, strict: true });
    if (RESERVED_SLUGS.includes(baseSlug)) baseSlug = `${baseSlug}-user`;
    let slug = baseSlug;
    let counter = 1;
    while (await User.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter += 1;
    }

    const user = await User.create({ name, email, password, slug });

    await Portfolio.create({
      user: user._id,
      hero: { title: name, subtitle: "Full Stack Developer", tagline: "Welcome to my portfolio" },
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      slug: user.slug,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route POST /api/auth/login
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: "This account has been deactivated" });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      slug: user.slug,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/auth/me
export const getMe = async (req, res) => {
  res.json(req.user);
};
