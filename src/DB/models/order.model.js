import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        products: [
            {
                type: { type: String,  }, // نوع المنتج
                name: { type: String, }, // اسم المنتج
                warehouseName: { type: String, }, // اسم المستودع
                quantity: { type: String,  }, // الكمية
                price: { type: String,  }, // السعر
                country: { type: String,  } // الدولة
            }
        ],
        address: { type: String, required: true },
        phone: { type: String, required: true },
        notes: { type: String },
        paidAmount: { type: Number, default: 0 },
        status: { type: String, default: "waiting" },
    },
    { timestamps: true }
);

export const OrderModel = mongoose.model("Order", orderSchema);
