import mongoose from "mongoose";

const portfolioSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },

    hero: {
      title: { type: String, default: "" },
      subtitle: { type: String, default: "" },
      tagline: { type: String, default: "" },
      resumeLink: { type: String, default: "" },
      profileImage: { type: String, default: "" },
    },

    about: {
      bio: { type: String, default: "" },
      image: { type: String, default: "" },
      highlights: [{ type: String }],
    },

    skills: [
      {
        name: { type: String, required: true },
        category: { type: String, default: "General" },
        level: { type: Number, min: 0, max: 100, default: 70 },
      },
    ],

    projects: [
      {
        title: { type: String, required: true },
        description: { type: String, default: "" },
        techStack: [{ type: String }],
        image: { type: String, default: "" },
        liveLink: { type: String, default: "" },
        githubLink: { type: String, default: "" },
        featured: { type: Boolean, default: false },
      },
    ],

    experience: [
      {
        company: { type: String, required: true },
        role: { type: String, required: true },
        duration: { type: String, default: "" },
        description: { type: String, default: "" },
      },
    ],

    education: [
      {
        institute: { type: String, required: true },
        degree: { type: String, default: "" },
        duration: { type: String, default: "" },
        description: { type: String, default: "" },
      },
    ],

    contact: {
      email: { type: String, default: "" },
      phone: { type: String, default: "" },
      location: { type: String, default: "" },
      socialLinks: {
        github: { type: String, default: "" },
        linkedin: { type: String, default: "" },
        twitter: { type: String, default: "" },
        instagram: { type: String, default: "" },
      },
    },

    defaultTheme: {
      type: String,
      enum: ["purple", "dark", "light", "ocean", "sunset"],
      default: "purple",
    },
  },
  { timestamps: true }
);

const Portfolio = mongoose.model("Portfolio", portfolioSchema);
export default Portfolio;
