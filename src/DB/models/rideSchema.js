import mongoose from "mongoose";

const rideSchema = new mongoose.Schema({
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    driverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    pickup: {
        latitude: Number,
        longitude: Number
    },
    dropoff: {
        latitude: Number,
        longitude: Number
    },
    price: Number,
    status: {
        type: String,
        enum: ["PENDING", "DONE", "CANCELLED", "driver on the way", "ongoing finished", "ACCEPTED","ongoing"],
        default: "PENDING"
    },
    cancellationReason: { type: String },
    
}, { timestamps: true });

export default mongoose.model("Ride", rideSchema);
