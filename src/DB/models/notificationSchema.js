// models/notification.model.js
import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restauranttt",  },
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Orderrr",  },
    title: String,
    body: String,
    deviceToken: String,
    isRead: { type: Boolean, default: false },
}, { timestamps: true });

export const NotificationModell = mongoose.model("Notificationnnn", notificationSchema);
