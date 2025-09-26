

import mongoose from "mongoose";

const CompanySchema = new mongoose.Schema({
    companyName: { type: String, unique: true, },
    description: { type: String, },
    industry: { type: String,  },
    address: { type: String,  },
    numberOfEmployees: { type: String, enum: ["1-10", "11-20", "21-50", "51-100", "100+"], required: true },
    companyEmail: { type: String, unique: true, },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    logo: {
        secure_url: { type: String },
        public_id: { type: String }
    },
    coverPic: [{
        secure_url: { type: String },
        public_id: { type: String },
    }],
    HRs: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    bannedAt: { type: Date, default: null },
    isBanned: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false } ,
    legalAttachments: [{
        public_id: String,
        secure_url: String,
        format: String
    }],
 
    approvedByAdmin: { type: Boolean, default: false }
}, { timestamps: true });

export const CompanyModel = mongoose.model("Company", CompanySchema);
