import mongoose from "mongoose";

const JobOpportunitySchema = new mongoose.Schema({
    jobTitle: { type: String, required: true },
    jobLocation: { type: String, enum: ["onsite", "remotely", "hybrid"]},
    workingTime: { type: String, enum: ["part-time", "full-time"]},
    seniorityLevel: {
        type: String,
        enum: ["fresh", "Junior", "Mid-Level", "Senior", "Team-Lead", "CTO"],
        required: true
    },
    jobDescription: { type: String,  },
    technicalSkills: [{ type: String }], // Array of required technical skills
    softSkills: [{ type: String,  }], // Array of required soft skills
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // HR who added it
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // HR who updated it
    closed: { type: Boolean, default: false }, // Is the job closed?
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true }, // Related company
}, { timestamps: true });

export const JobOpportunityModel = mongoose.model("JobOpportunity", JobOpportunitySchema);
