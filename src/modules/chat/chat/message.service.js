import ChatModel from "../../../DB/models/chaatmodel.js";
import Usermodel, { scketConnections } from "../../../DB/models/User.model.js";
import { authenticationSocket } from "../../../middlewere/auth.socket.middlewere.js";
import * as dbservice from "../../../DB/dbservice.js"
import mongoose from 'mongoose';


export const sendMessage = (socket) => {
    return socket.on("sendMessage", async (messageData) => {
        try {
            const { data } = await authenticationSocket({ socket });

            if (!data.valid) {
                return socket.emit("socketErrorResponse", data);
            }

            const userId = data.user._id.toString();
            const { destId, message } = messageData;

            // التحقق من صحة الـ ObjectId
            if (!mongoose.Types.ObjectId.isValid(destId)) {
                return socket.emit("socketErrorResponse", {
                    message: "معرف المستخدم الهدف غير صالح"
                });
            }

            const chat = await dbservice.findOneAndUpdate({
                model: ChatModel,
                filter: {
                    $or: [
                        {
                            mainUser: new mongoose.Types.ObjectId(userId),
                            subpartisipant: new mongoose.Types.ObjectId(destId)
                        },
                        {
                            mainUser: new mongoose.Types.ObjectId(destId),
                            subpartisipant: new mongoose.Types.ObjectId(userId)
                        }
                    ]
                },
                data: {
                    $push: {
                        messages: {
                            text: message,
                            senderId: new mongoose.Types.ObjectId(userId)
                        }
                    }
                },
                options: { new: true, upsert: true }
            });

            // إرسال الرسالة للطرف الآخر
            const receiverSocket = scketConnections.get(destId);
            if (receiverSocket) {
                socket.to(receiverSocket).emit("receiveMessage", {
                    message: message,
                    senderId: userId
                });
            }

            socket.emit("successMessage", { message });

        } catch (error) {
            console.error('Error in sendMessage:', error);
            socket.emit("socketErrorResponse", {
                message: "حدث خطأ أثناء إرسال الرسالة"
            });
        }
    });
};


export const driverLocationUpdate = (socket) => {
    return socket.on("driverLocationUpdate", async (locationData) => {
        try {
            const { data } = await authenticationSocket({ socket });

            if (!data.valid) {
                return socket.emit("socketErrorResponse", data);
            }

            const userId = data.user._id.toString();
            const { longitude, latitude } = locationData;

            if (!longitude || !latitude) {
                return socket.emit("socketErrorResponse", {
                    message: "❌ مطلوب إرسال خط الطول والعرض"
                });
            }

            // تحديث مكان السواق في قاعدة البيانات
            await Usermodel.findByIdAndUpdate(userId, {
                location: {
                    type: "Point",
                    coordinates: [longitude, latitude]
                }
            });

            // رجع تأكيد للسواق
            socket.emit("locationUpdated", {
                message: "✅ تم تحديث الموقع بنجاح"
            });

        } catch (error) {
            console.error("Error in driverLocationUpdate:", error);
            socket.emit("socketErrorResponse", {
                message: "❌ حدث خطأ أثناء تحديث الموقع"
            });
        }
    });
};