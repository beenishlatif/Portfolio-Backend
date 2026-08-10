import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import portfolioRoutes from "./routes/portfolioRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

dotenv.config();
connectDB();

const app = express();

// --- CORS setup (important for Vercel: frontend and backend are separate deployments) ---
const envOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map((url) => url.trim())
  .filter(Boolean);

const allowedOrigins = [
  "http://localhost:5173",
  "https://portfolio-frontend-wine-mu.vercel.app", // hardcoded fallback in case CLIENT_URL env var is missing/wrong on Vercel
  ...envOrigins,
];

// Debug log on cold start - check Vercel function logs to confirm this is correct
console.log("Allowed CORS origins:", allowedOrigins);

const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    // log so it's visible in Vercel's function logs when something gets blocked
    console.warn(`CORS blocked request from origin: "${origin}"`);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// NOTE: Removed the explicit `app.options("*", cors(corsOptions))` line.
// The cors middleware above already handles OPTIONS preflight requests automatically
// when used via app.use(). The bare "*" wildcard route was crashing on newer
// Express/path-to-regexp versions on Vercel, which caused the function to fail
// BEFORE any CORS headers could be set — that's what was showing up as a
// "No Access-Control-Allow-Origin header" error in the browser.

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Portfolio API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/upload", uploadRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});

const PORT = process.env.PORT || 5000;

// Vercel serverless: only listen when run locally, not when imported as a function
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

export default app;