import mongoose from "mongoose";

const branchSchema = new mongoose.Schema({
    name1: {
        en: { type: String,  trim: true }, // 🏷️ اسم الفرع بالإنجليزية
        ar: { type: String, trim: true }  // 🏷️ اسم الفرع بالعربية
    },
    name2: {
        en: { type: String,  trim: true }, // 🏷️ اسم الفرع بالإنجليزية
        ar: { type: String,  trim: true }  // 🏷️ اسم الفرع بالعربية
    },
 
    address: {
        en: { type: String,  trim: true }, // 🏠 العنوان بالإنجليزية
        ar: { type: String,  trim: true }  // 🏠 العنوان بالعربية
    },

    phone: {
        type: Number,
    },
    locationLink: {
        type: String,
        required: false, // 🌍 رابط الموقع (يمكن تركه فارغًا)
        trim: true
    }
}, { timestamps: true });

export const BranchModel = mongoose.model("Branch", branchSchema);
