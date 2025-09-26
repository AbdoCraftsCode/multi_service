import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
    phone: { type: String, required: true },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true },
}, { timestamps: true });

const OtpModel = mongoose.model('Otp', otpSchema);

export default OtpModel;
