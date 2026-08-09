import User from "../models/User.js";
import Portfolio from "../models/Portfolio.js";

// @route GET /api/portfolio/:slug   (PUBLIC - used by the main visitor-facing site)
export const getPortfolioBySlug = async (req, res) => {
  try {
    const user = await User.findOne({ slug: req.params.slug.toLowerCase(), isActive: true }).select(
      "name email slug avatar"
    );

    if (!user) {
      return res.status(404).json({ message: "No portfolio found for this address" });
    }

    const portfolio = await Portfolio.findOne({ user: user._id });

    if (!portfolio) {
      return res.status(404).json({ message: "This admin has not set up their portfolio yet" });
    }

    res.json({ owner: user, portfolio });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/portfolio/me   (PROTECTED - the logged-in admin's own data, for the dashboard)
export const getMyPortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.user._id });
    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio not found" });
    }
    res.json(portfolio);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route PUT /api/portfolio/me   (PROTECTED - full or partial update)
export const updateMyPortfolio = async (req, res) => {
  try {
   const allowedFields = [
  "hero",
  "about",
  "skills",
  "projects",
  "experience",
  "education",
  "contact",
  "defaultTheme",
  "techStack",
  "services",
  "whyChooseMe",
  "process",
  "github",
  "currentFocus",
  "testimonials",
];

    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    }

    const portfolio = await Portfolio.findOneAndUpdate(
      { user: req.user._id },
      { $set: updates },
      { new: true, runValidators: true, upsert: true }
    );

    res.json(portfolio);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
