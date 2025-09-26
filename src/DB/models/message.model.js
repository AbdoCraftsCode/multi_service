import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        firstName: { type: String, required: [true, "❌ الاسم الأول مطلوب!"] },
        lastName: { type: String, required: [true, "❌ الاسم الثاني مطلوب!"] },
        phone: {
            type: String,
            required: [true, "❌ رقم الهاتف مطلوب!"],
           
        },
        email: {
            type: String,
            required: [true, "❌ البريد الإلكتروني مطلوب!"],
           
        },
        message: {
            type: String,
            required: [true, "❌ يجب إدخال نص الرسالة!"],
            
        }
    },
    { timestamps: true }
);

export const MessageModel = mongoose.model("Message", messageSchema);
