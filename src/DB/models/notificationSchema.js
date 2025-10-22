// models/notification.model.js
import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restauranttt",  },
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Orderrr", },
    supermarket: { type: mongoose.Schema.Types.ObjectId, ref: "Supermarket" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    
    // ⬅️ العميل اللي وُجه له الإشعار
    driver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    title: String,
    type: String,
    body: String,
    deviceToken: String,
    isRead: { type: Boolean, default: false },
}, { timestamps: true });

export const NotificationModell = mongoose.model("Notificationnnn", notificationSchema);
