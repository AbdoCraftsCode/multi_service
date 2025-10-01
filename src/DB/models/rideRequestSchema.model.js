import mongoose from "mongoose";

const rideRequestSchema = new mongoose.Schema(
    {
        rideId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Ride",
            required: true,
        },
        clientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        driverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        clientName: {
            type: String,
            required: true,
            trim: true,
        },
        pickup: {
            latitude: { type: Number, required: true },
            longitude: { type: Number, required: true },
        },
        dropoff: {
            latitude: { type: Number, required: true },
            longitude: { type: Number, required: true },
        },
        price: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "accepted", "rejected", "started", "finished"],
            default: "pending",
        },
    },
    { timestamps: true }
);

export const RideRequestModel = mongoose.model("RideRequest", rideRequestSchema);
