// models/customContent.model.js
import mongoose from "mongoose";

const customContentSchema = new mongoose.Schema({
    title: { type: String, required: true },         // العنوان
    topic: { type: String },                         // الموضوع
    content: { type: String },                       // المحتوى
    time: { type: String, required: true },          // الوقت بصيغة نصية
    image: {
        secure_url: { type: String },
        public_id: { type: String }
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true });

export const CustomContentModel = mongoose.model("CustomContent", customContentSchema);
