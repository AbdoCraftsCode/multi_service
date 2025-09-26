// models/Permission.model.js
import mongoose from "mongoose";

const permissionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    description: {
        type: String,
        default: ""
    },
    // createdBy: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "User", // أو "Admin"
    //     required: true
    // }
}, { timestamps: true });

export const PermissionModel = mongoose.model("Permission", permissionSchema);
