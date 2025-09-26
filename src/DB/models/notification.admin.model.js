import mongoose from "mongoose";
const adminNotificationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: String,
    body: String,
    isRead: { type: Boolean, default: false },
}, { timestamps: true });

export const AdminNotificationModel = mongoose.model("AdminNotification", adminNotificationSchema);