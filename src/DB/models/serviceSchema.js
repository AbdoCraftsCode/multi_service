import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
    serviceName: {
        type: String,
        required: true,
        trim: true
    },
    accountNumber: {
        type: String,
        required: true,
        trim: true
    },
    accountName: {
        type: String,
        required: true,
        trim: true
    },
    servicePicture: {
        secure_url: { type: String, default: null },
        public_id: { type: String, default: null }
    }
}, { timestamps: true });

export const ServiceModel = mongoose.model("Service", serviceSchema);

