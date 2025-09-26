// models/MainGroup.model.js
import mongoose from "mongoose";

const mainGroupSchema = new mongoose.Schema({
    name: { type: String, required: true },
    status: { type: String, required: true },
    createdBy: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true });


export const MainGroupModel = mongoose.model("MainGroup", mainGroupSchema);
