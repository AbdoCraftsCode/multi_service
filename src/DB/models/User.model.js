

// import mongoose, { Schema, Types, model } from "mongoose";

// export const roletypes = { User: "User", Admin: "Admin", Owner:"Owner"}
// export const providerTypes = { system: "system", google: "google" }

// const userSchema = new Schema({
//     fullName: { type: String, required: true },
//     email: { type: String, unique: true, sparse: true, trim: true },
//     phone: { type: String, unique: true, sparse: true, trim: true },

//     password: { type: String },
//     isConfirmed: { type:Boolean ,default:false },
//     accountType: { type: String, enum: ['User', 'ServiceProvider'], required: true },
//     serviceType: { type: String, enum: ['Driver', 'Doctor', 'Host', 'Delivery'], default: null },
//     // الربط مع بيانات الخدمة (مثلاً DoctorProfile)
//     serviceRef: {
//         type: mongoose.Schema.Types.ObjectId,
//         refPath: 'serviceTypeRef',
//     },
//     serviceTypeRef: {
//         type: String,
//         enum: ['DriverProfile', 'DoctorProfile', 'HostProfile', 'DeliveryProfile'],
//     },
//     emailOTP: String,
//     forgetpasswordOTP: String,
//     attemptCount: Number,
//     otpExpiresAt: Date,
//     blockUntil: {
//         type: Date,
//     },
// },
//     {
//         timestamps: true,
//         toJSON: { virtuals: true },
//         toObject: { virtuals: true }
//     }

// );




// const Usermodel = mongoose.model("User", userSchema);
// export default Usermodel;
// export const scketConnections = new Map()
// export const onlineUsers = new Map();



import mongoose, { Schema, Types, model } from "mongoose";

export const roletypes = { User: "User", Admin: "Admin", Owner: "Owner" };
export const providerTypes = { system: "system", google: "google" };

const userSchema = new Schema({
    fullName: { type: String, required: true },
    role: { type: String,  },
    email: { type: String, unique: true, sparse: true, trim: true },
    phone: { type: String, unique: true, sparse: true, trim: true },

    password: { type: String },
    isConfirmed: { type: Boolean, default: false },

    accountType: {
        type: String,
        enum: ['User', 'ServiceProvider','Owner'],
        required: true
    },

    serviceType: {
        type: String,
        enum: ['Driver', 'Doctor', 'Host', 'Delivery'],
        default: null
    },

    serviceRef: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'serviceTypeRef',
    },

    serviceTypeRef: {
        type: String,
        enum: ['DriverProfile', 'DoctorProfile', 'HostProfile', 'DeliveryProfile'],
    },

    // OTPs
    emailOTP: String,
    forgetpasswordOTP: String,
    attemptCount: Number,
    otpExpiresAt: Date,
    blockUntil: { type: Date },

    // 🎯 بيانات إضافية عامة لمقدمي الخدمة
    nationalIdImage: {
        secure_url: String,
        public_id: String
    },
    driverLicenseImage: {
        secure_url: String,
        public_id: String
    },
    carLicenseImage: {
        secure_url: String,
        public_id: String
    },
    carImages: [{
        secure_url: String,
        public_id: String
    }],
    additionalDocuments: {
        secure_url: String,
        public_id: String
    },

    profiePicture: {
        secure_url: String,
        public_id: String
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

const Usermodel = mongoose.model("User", userSchema);
export default Usermodel;

export const scketConnections = new Map();
export const onlineUsers = new Map();
