// models/AdminUser.model.js
import mongoose from "mongoose";
// import bcrypt from "bcryptjs";

const adminUserSchema = new mongoose.Schema({
    name: {
        type: String,
        // required: true,
        trim: true
    },
    email: { type: String, required: true, unique: true, trim: true },

    phone: {
        type: String,
        // required: true,
        unique: true
    },

    password: {
        type: String,
        // required: true
    },

    branch: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Branchhh",
        // required: true
    }],


    mainGroup: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "MainGroup",
        // required: true
    }],


    subGroup: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubGroup",
        // required: true
    }],


    permissions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Permission"
    }],

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // صاحب المطعم اللي أنشأ الأدمن
        required: true
    },
    profileImage: {
        secure_url: String,
        public_id: String
    }

    
}, { timestamps: true });


// تشفير كلمة المرور قبل الحفظ


export const AdminUserModel = mongoose.model("AdminUser", adminUserSchema);
