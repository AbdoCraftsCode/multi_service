import mongoose from "mongoose";

const socialMediaSchema = new mongoose.Schema({
    phone: { type: String },
    whatsapp: { type: String },
    facebook: { type: String },
    twitter: { type: String },
    instagram: { type: String },
    tiktok: { type: String },
    snapchat: { type: String },
    youtupe: { type: String }
      
    
}, { timestamps: true });

export const SocialMediaModel = mongoose.model("SocialMedia", socialMediaSchema);