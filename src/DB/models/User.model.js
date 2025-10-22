

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
    email: { type: String, sparse: true, trim: true },
    phone: { type: String,  sparse: true, trim: true },

    password: { type: String },
    isConfirmed: { type: Boolean, default: false },
    carNumber: { type: Number, default: 0 },
    isAgree: { type: Boolean, default: false },

    kiloPrice: { type: Number, default: 0 },
    totalPoints: { type: Number, default: 0 },
    modelcar: { type: String, default: null },
    accountType: {
        type: String,
        enum: ['User', 'ServiceProvider', 'Owner', 'manager', 'staff','Admin'],
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
    fcmToken: { type: String, default: null },
    isOnline: { type: Boolean , default: false },
    userId: String,
    // OTPs
    emailOTP: String,
    forgetpasswordOTP: String,
    attemptCount: Number,
    otpExpiresAt: Date,
    blockUntil: { type: Date },

    // 🎯 بيانات إضافية عامة لمقدمي الخدمة
    nationalIdImage: {
        secure_url: { type: String, default: null },
        public_id: { type: String, default: null }
    },
    driverLicenseImage: {
        secure_url: { type: String, default: null },
        public_id: { type: String, default: null }
    },
    carLicenseImage: {
        secure_url: { type: String, default: null },
        public_id: { type: String, default: null }
    },
    carImages: [{
        secure_url: { type: String, default: null },
        public_id: { type: String, default: null }
    }],
    Insurancedocuments: {
        secure_url: { type: String, default: null },
        public_id: { type: String, default: null }
    },

    profiePicture: {
        secure_url: { type: String, default: null },
        public_id: { type: String, default: null }
    },

    subscription: {
        startDate: { type: Date, default: Date.now }, // تاريخ بداية الاشتراك
        endDate: {
            type: Date,
            default: () => new Date(Date.now() + 15 * 24 * 60 * 60 * 1000) // 15 يوم افتراضي
        },
        planType: { type: String, default: "FreeTrial" } // FreeTrial | Premium | Custom
    },

    location: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point"
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            default: [0, 0]
        }
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
}); 
userSchema.virtual("subscriptionDaysLeft").get(function () {
    if (!this.subscription?.endDate) return null;
    const diff = Math.ceil(
        (this.subscription.endDate - new Date()) / (1000 * 60 * 60 * 24)
    );
    return diff > 0 ? diff : 0;
});

userSchema.virtual("subscriptionDaysUsed").get(function () {
    if (!this.subscription?.startDate) return null;
    const diff = Math.ceil(
        (new Date() - this.subscription.startDate) / (1000 * 60 * 60 * 24)
    );
    return diff > 0 ? diff : 0;
});

const Usermodel = mongoose.model("User", userSchema);
userSchema.index({ location: "2dsphere" });
export default Usermodel;

export const scketConnections = new Map();
export const onlineUsers = new Map();
