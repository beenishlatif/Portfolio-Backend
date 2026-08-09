import express from "express";
import {
  getPortfolioBySlug,
  getMyPortfolio,
  updateMyPortfolio,
} from "../controllers/portfolioController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Protected routes must come before the dynamic /:slug route
router.get("/me", protect, getMyPortfolio);
router.put("/me", protect, updateMyPortfolio);

// Public route - visitor facing
router.get("/:slug", getPortfolioBySlug);

export default router;
