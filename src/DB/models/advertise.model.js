import mongoose from "mongoose";

const advirtSchema = new mongoose.Schema({
    image: [{
        secure_url: { type: String },
        public_id: { type: String },
    }],
}, { timestamps: true });

export const AdvirtModel = mongoose.model("Advirt", advirtSchema);
