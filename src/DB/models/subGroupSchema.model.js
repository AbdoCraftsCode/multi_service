// models/SubGroup.model.js
import mongoose from "mongoose";

const subGroupSchema = new mongoose.Schema({
    name: { type: String, required: true },
    mainGroup: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MainGroup",
        required: true
    },
    createdBy: { // ✅ المستخدم اللي أنشأ المجموعة الفرعية
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true });


export const SubGroupModel = mongoose.model("SubGroup", subGroupSchema);
