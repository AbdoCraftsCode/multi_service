
import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema({
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "JobOpportunity", }, 
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User",  },
    userCV: {
        secure_url: { type: String, },
        public_id: { type: String,  }
    }, 
    status: {
        type: String,
        enum: ["pending", "accepted", "viewed", "in consideration", "rejected"],
        default: "pending"
    } 
}, { timestamps: true });


ApplicationSchema.virtual("userDetails", {
    ref: "User",
    localField: "userId",
    foreignField: "_id",
    justOne: true, 
});


ApplicationSchema.set("toObject", { virtuals: true });
ApplicationSchema.set("toJSON", { virtuals: true });


export const ApplicationModel = mongoose.model("Application", ApplicationSchema);
