

import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
    {
        name: {
            en: { type: String, required: true, trim: true },
            ar: { type: String, required: true, trim: true }
        },
        image: {
            secure_url: { type: String, required: true }, // الصورة مطلوبة
            public_id: { type: String, required: true }   // مهم لحذف الصور من Cloudinary
        },
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        }
    },
    { timestamps: true }
);

export const CategoryModel = mongoose.model("Category", categorySchema);

