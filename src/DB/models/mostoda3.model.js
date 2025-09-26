

import mongoose from "mongoose";

const MostawdaaSchema = new mongoose.Schema(
    {
        name: {
            en: { type: String, required: true, trim: true },
            ar: { type: String, required: true, trim: true }
        },
          order: { type: Number, default: 0 } ,
        image: {
            secure_url: { type: String, required: true }, // الصورة مطلوبة
            public_id: { type: String, required: true }   // مهم لحذف الصور من Cloudinary
        },
        location1: {
            en: { type: String,  trim: true },
            ar: { type: String,  trim: true }
        },
        location2: {
            en: { type: String,  trim: true },
            ar: { type: String,  trim: true }
        },
        owner: {
            en: { type: String,  trim: true },
            ar: { type: String,  trim: true }
        },
        workdate: {
            en: { type: String, trim: true },
            ar: { type: String,  trim: true }
        },
        phone: {
            type: String,
        },
        watsapp: {
            type: String,
        },
        
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        }
    },
    { timestamps: true }
);

export const MostawdaaModel = mongoose.model("Mostawdaa", MostawdaaSchema);

