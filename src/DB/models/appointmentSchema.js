// models/appointment.model.js
import mongoose, { Schema } from "mongoose";

const appointmentSchema = new Schema({
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // اللي عمل الحجز
    date: { type: String, required: true }, // مثال: "2025-08-20"
    time: { type: String, required: true }, // مثال: "14:30"
    additionalNotes: { type: String },

    status: {
        type: String,
        enum: ["pending", "confirmed", "cancelled"],
        default: "pending"
    }
}, { timestamps: true });

export const AppointmentModel = mongoose.model("Appointment", appointmentSchema);
