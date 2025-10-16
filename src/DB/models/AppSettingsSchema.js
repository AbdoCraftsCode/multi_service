// models/AppSettings.model.js
import mongoose from "mongoose";

const AppSettingsSchema = new mongoose.Schema({
    whatsappNumber: {
        type: String,
        required: true,
        trim: true,
    },
    privacyPolicy: {
        type: [String], // مصفوفة نصوص
        default: [],
    },
}, { timestamps: true });

export default mongoose.model("AppSettings", AppSettingsSchema);
