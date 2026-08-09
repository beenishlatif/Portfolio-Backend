import mongoose from "mongoose";

const portfolioSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },

    hero: {
      title: { type: String, default: "" },
      subtitle: { type: String, default: "" },
      tagline: { type: String, default: "" },
      resumeLink: { type: String, default: "" },
      githubLink: { type: String, default: "" }, // NEW - prominent GitHub button in hero
      profileImage: { type: String, default: "" },
      roles: [{ type: String }],
      location: { type: String, default: "" },
      yearsOfExperience: { type: Number, default: 0 },
      availableForWork: { type: Boolean, default: true },
      stats: [
        {
          label: { type: String, default: "" },
          value: { type: String, default: "" },
        },
      ],
      services: [
        // NEW - folded in from old standalone "Services" section
        {
          title: { type: String, default: "" },
          description: { type: String, default: "" },
        },
      ],
      whyChooseMe: [
        // NEW - folded in from old standalone "Why Choose Me" section
        {
          title: { type: String, default: "" },
          description: { type: String, default: "" },
        },
      ],
    },

    about: {
      bio: { type: String, default: "" },
      image: { type: String, default: "" },
      highlights: [{ type: String }],
      approach: { type: String, default: "" }, // NEW - longer "how I work" paragraph
    },

    techStack: [{ type: String }],

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
        screenshots: [{ type: String }], // NEW - gallery
        video: { type: String, default: "" }, // NEW - demo video URL
        liveLink: { type: String, default: "" },
        githubLink: { type: String, default: "" },
        featured: { type: Boolean, default: false },
      },
    ],

    experience: [
      {
        company: { type: String, required: true },
        role: { type: String, required: true },
        location: { type: String, default: "" }, // NEW
        duration: { type: String, default: "" },
        current: { type: Boolean, default: false }, // NEW - "currently working here"
        description: { type: String, default: "" },
        achievements: [{ type: String }], // NEW - bullet points
      },
    ],

    education: [
      {
        university: { type: String, required: true }, // NEW name (was "institute")
        degree: { type: String, default: "" },
        fieldOfStudy: { type: String, default: "" }, // NEW
        duration: { type: String, default: "" },
        gpa: { type: String, default: "" }, // NEW
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