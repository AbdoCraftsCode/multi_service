import ChatModel from "../../../DB/models/chaatmodel.js";
import Usermodel, { scketConnections } from "../../../DB/models/User.model.js";
import { authenticationSocket } from "../../../middlewere/auth.socket.middlewere.js";
import * as dbservice from "../../../DB/dbservice.js"
import mongoose from 'mongoose';
import { getIo } from "../chat.socket.controller.js";
import rideSchema from "../../../DB/models/rideSchema.js";


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


// export const driverLocationUpdate = (socket) => {
//     socket.on("driverLocationUpdate", async ({ longitude, latitude }) => {
//         try {
//             const { data } = await authenticationSocket({ socket });
//             if (!data.valid) {
//                 return socket.emit("socketErrorResponse", data);
//             }

//             const driverId = data.user._id.toString();

//             if (!longitude || !latitude) {
//                 return socket.emit("socketErrorResponse", {
//                     message: "❌ مطلوب إرسال خط الطول والعرض"
//                 });
//             }

//             // تحديث مكان السواق في قاعدة البيانات
//             await Usermodel.findByIdAndUpdate(driverId, {
//                 location: {
//                     type: "Point",
//                     coordinates: [longitude, latitude]
//                 }
//             });

//             // ✅ رجع تأكيد للسواق نفسه
//             socket.emit("locationUpdated", {
//                 message: "✅ تم تحديث الموقع بنجاح"
//             });

//             // ✅ ابث تحديث لكل العملاء اللي عندهم موقع محفوظ
//             const io = getIo();
//             io.sockets.sockets.forEach((clientSocket) => {
//                 if (clientSocket.userLocation) {
//                     const { longitude: clientLng, latitude: clientLat } = clientSocket.userLocation;

//                     // حساب المسافة (Haversine)
//                     const R = 6371;
//                     const dLat = (latitude - clientLat) * Math.PI / 180;
//                     const dLng = (longitude - clientLng) * Math.PI / 180;
//                     const a =
//                         Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//                         Math.cos(clientLat * Math.PI / 180) *
//                         Math.cos(latitude * Math.PI / 180) *
//                         Math.sin(dLng / 2) * Math.sin(dLng / 2);
//                     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//                     const distance = R * c;

//                     // إرسال تحديث لحظي للعميل
//                     clientSocket.emit("driverLocationUpdate", {
//                         driverId,
//                         longitude,
//                         latitude,
//                         distance: Number(distance.toFixed(2))
//                     });
//                 }
//             });

//         } catch (error) {
//             console.error("Error in driverLocationUpdate:", error);
//             socket.emit("socketErrorResponse", {
//                 message: "❌ حدث خطأ أثناء تحديث الموقع"
//             });
//         }
//     });
// };


export const driverLocationUpdate = (socket) => {
    socket.on("driverLocationUpdate", async ({ longitude, latitude }) => {
        try {
            const { data } = await authenticationSocket({ socket });
            if (!data.valid) {
                return socket.emit("socketErrorResponse", data);
            }

            const driverId = data.user._id.toString();

            if (!longitude || !latitude) {
                return socket.emit("socketErrorResponse", {
                    message: "❌ مطلوب إرسال خط الطول والعرض"
                });
            }

            await Usermodel.findByIdAndUpdate(driverId, {
                location: {
                    type: "Point",
                    coordinates: [longitude, latitude]
                }
            });

            socket.emit("locationUpdated", {
                message: "✅ تم تحديث الموقع بنجاح"
            });

            const io = getIo();

            // ✅ لو السواق مرتبط بعميل محدد، ابعت التحديث له فقط
            if (socket.currentClientId) {
                const clientSocket = Array.from(io.sockets.sockets.values())
                    .find(s => s.userId === socket.currentClientId);

                if (clientSocket && clientSocket.userLocation) {
                    const { longitude: clientLng, latitude: clientLat } = clientSocket.userLocation;

                    const R = 6371;
                    const dLat = (latitude - clientLat) * Math.PI / 180;
                    const dLng = (longitude - clientLng) * Math.PI / 180;
                    const a =
                        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                        Math.cos(clientLat * Math.PI / 180) *
                        Math.cos(latitude * Math.PI / 180) *
                        Math.sin(dLng / 2) * Math.sin(dLng / 2);
                    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                    const distance = R * c;

                    clientSocket.emit("driverLocationUpdate", {
                        driverId,
                        longitude,
                        latitude,
                        distance: Number(distance.toFixed(2))
                    });
                }
            }

        } catch (error) {
            console.error("Error in driverLocationUpdate:", error);
            socket.emit("socketErrorResponse", {
                message: "❌ حدث خطأ أثناء تحديث الموقع"
            });
        }
    });
};

















// لما العميل يشارك موقعه
export const userLocationUpdate = (socket) => {
    socket.on("userLocationUpdate", async ({ longitude, latitude }) => {
        try {
            const { data } = await authenticationSocket({ socket });
            if (!data.valid) {
                return socket.emit("socketErrorResponse", data);
            }

            if (!longitude || !latitude) {
                return socket.emit("socketErrorResponse", {
                    message: "❌ مطلوب إرسال خط الطول والعرض"
                });
            }

            // 📝 خزّن موقع العميل في الـ socket
            socket.userLocation = { longitude, latitude };

            // 🔍 رجّعله السواقين القريبين أول مرة
            const drivers = await Usermodel.aggregate([
                {
                    $geoNear: {
                        near: { type: "Point", coordinates: [longitude, latitude] },
                        distanceField: "distance",
                        spherical: true,
                        maxDistance: 10000
                    }
                },
                { $match: { serviceType: "Driver" } },
                {
                    $project: {
                        fullName: 1,
                        kiloPrice: 1,   // ✅ سعر الكيلو
                        "profilePicture.secure_url": 1, // ✅ الصورة
                        // "profilePicture.secure_url": 1,
                        distance: { $divide: ["$distance", 1000] }
                    }
                }
            ]);

            socket.emit("nearbyDrivers", drivers);

        } catch (err) {
            console.error("Error in userLocationUpdate:", err);
            socket.emit("socketErrorResponse", { message: "❌ خطأ داخلي" });
        }
    });
};

// export const rideRequest = (socket) => {
//     socket.on("sendRideRequest", async ({ driverId, pickup, dropoff, price }) => {
//         try {
//             const { data } = await authenticationSocket({ socket });
//             if (!data.valid) return socket.emit("socketErrorResponse", data);

//             const io = getIo(); // 🔹 لازم تعريف io قبل أي استخدام

//             console.log("🔎 driverId المطلوب:", driverId);
//             console.log("🧑‍🤝‍🧑 كل السوكتس:", Array.from(io.sockets.sockets.values()).map(s => ({
//                 socketId: s.id,
//                 userId: s.userId
//             })));

//             // 🔹 خزن موقع العميل في الـ socket
//             socket.userLocation = pickup;

//             // 🔹 جلب السوك الذي اختاره العميل
//             const driverSocket = Array.from(io.sockets.sockets.values())
//                 .find(s => s.userId === driverId);

//             if (!driverSocket) {
//                 return socket.emit("socketErrorResponse", { message: "❌ السواق غير متصل" });
//             }

//             // 🔹 إرسال الطلب للسواق المختار فقط
//             driverSocket.emit("newRideRequest", {
//                 clientId: data.user._id,
//                 clientName: data.user.fullName,
//                 pickup,
//                 dropoff,
//                 price
//             });

//             // 🔹 تأكيد للعميل أن الطلب تم إرساله
//             socket.emit("rideRequestSent", {
//                 message: "✅ تم إرسال الطلب للسواق المختار"
//             });

//         } catch (err) {
//             console.error("Error in sendRideRequest:", err);
//             socket.emit("socketErrorResponse", { message: "❌ خطأ أثناء إرسال الطلب" });
//         }
//     });
// };

export const rideRequest = (socket) => {
    socket.on("sendRideRequest", async ({ driverId, pickup, dropoff, price }) => {
        try {
            const { data } = await authenticationSocket({ socket });
            if (!data.valid) return socket.emit("socketErrorResponse", data);

            const io = getIo();

            // ✅ إنشاء الرحلة وتخزينها
            const newRide = await rideSchema.create({
                clientId: data.user._id,
                driverId,
                pickup,
                dropoff,
                price
            });

            // 🔹 خزن موقع العميل في الـ socket
            socket.userLocation = pickup;

            // 🔹 جلب السوك الذي اختاره العميل
            const driverSocket = Array.from(io.sockets.sockets.values())
                .find(s => s.userId === driverId);

            if (!driverSocket) {
                return socket.emit("socketErrorResponse", { message: "❌ السواق غير متصل" });
            }

            // 🔹 إرسال الطلب للسواق مع ID الرحلة
            driverSocket.emit("newRideRequest", {
                rideId: newRide._id,
                clientId: data.user._id,
                clientName: data.user.fullName,
                pickup,
                dropoff,
                price
            });

            // 🔹 تأكيد للعميل أن الطلب تم إرساله + كل بيانات الرحلة
            socket.emit("rideRequestSent", {
                message: "✅ تم إرسال الطلب للسواق المختار",
                rideId: newRide._id,
                clientId: data.user._id,
                driverId,
                pickup,
                dropoff,
                price
            });

        } catch (err) {
            console.error("Error in sendRideRequest:", err);
            socket.emit("socketErrorResponse", { message: "❌ خطأ أثناء إرسال الطلب" });
        }
    });
};




// export const rideResponse = (socket) => {
//     socket.on("rideResponse", async ({ clientId, accepted, driverLocation }) => {
//         try {
//             const { data } = await authenticationSocket({ socket });
//             if (!data.valid) return socket.emit("socketErrorResponse", data);

//             const io = getIo();

//             // 🔹 تحديث موقع السواق لو مبعوت من الحدث
//             if (driverLocation) {
//                 socket.userLocation = driverLocation;
//             }

//             // 🔹 جلب سوكيت العميل
//             const clientSocket = Array.from(io.sockets.sockets.values())
//                 .find(s => s.userId === clientId);

//             if (!clientSocket) {
//                 return socket.emit("socketErrorResponse", { message: "❌ العميل غير متصل" });
//             }

//             if (accepted) {
//                 // 🟢 لو السواق قبل
//                 if (!socket.userLocation) {
//                     return socket.emit("socketErrorResponse", { message: "❌ لازم تبعت موقعك الأول" });
//                 }
//                 if (!clientSocket.userLocation) {
//                     return socket.emit("socketErrorResponse", { message: "❌ العميل لم يرسل موقعه" });
//                 }

//                 // 🔹 حساب المسافة بين السواق والعميل
//                 function calcDistance(coord1, coord2) {
//                     const R = 6371;
//                     const dLat = (coord2.latitude - coord1.latitude) * Math.PI / 180;
//                     const dLng = (coord2.longitude - coord1.longitude) * Math.PI / 180;
//                     const a = Math.sin(dLat / 2) ** 2 +
//                         Math.cos(coord1.latitude * Math.PI / 180) *
//                         Math.cos(coord2.latitude * Math.PI / 180) *
//                         Math.sin(dLng / 2) ** 2;
//                     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//                     return R * c;
//                 }

//                 const distance = calcDistance(socket.userLocation, clientSocket.userLocation);

//                 clientSocket.emit("rideAccepted", {
//                     driverId: data.user._id,
//                     driverName: data.user.fullName,
//                     driverLocation: socket.userLocation,
//                     distance: distance.toFixed(2)
//                 });

//                 socket.emit("responseSent", { message: "✅ أرسلت موافقة للعميل" });

//             } else {
//                 // 🔴 لو السواق رفض
//                 clientSocket.emit("rideRejected", {
//                     driverId: data.user._id,
//                     driverName: data.user.fullName
//                 });

//                 socket.emit("responseSent", { message: "✅ أرسلت رفض للعميل" });
//             }

//         } catch (err) {
//             console.error("Error in rideResponse:", err);
//             socket.emit("socketErrorResponse", { message: "❌ خطأ أثناء إرسال رد الطلب" });
//         }
//     });
// };

// export const rideResponse = (socket) => {
//     socket.on("rideResponse", async ({ clientId, accepted, driverLocation }) => {
//         try {
//             const { data } = await authenticationSocket({ socket });
//             if (!data.valid) return socket.emit("socketErrorResponse", data);

//             const io = getIo();

//             if (driverLocation) {
//                 socket.userLocation = driverLocation;
//             }

//             const clientSocket = Array.from(io.sockets.sockets.values())
//                 .find(s => s.userId === clientId);

//             if (!clientSocket) {
//                 return socket.emit("socketErrorResponse", { message: "❌ العميل غير متصل" });
//             }

//             if (accepted) {
//                 // 🟢 لو السواق قبل
//                 socket.currentClientId = clientId; // ✅ تخزين العميل اللي السواق قبله

//                 if (!socket.userLocation) {
//                     return socket.emit("socketErrorResponse", { message: "❌ لازم تبعت موقعك الأول" });
//                 }
//                 if (!clientSocket.userLocation) {
//                     return socket.emit("socketErrorResponse", { message: "❌ العميل لم يرسل موقعه" });
//                 }

//                 function calcDistance(coord1, coord2) {
//                     const R = 6371;
//                     const dLat = (coord2.latitude - coord1.latitude) * Math.PI / 180;
//                     const dLng = (coord2.longitude - coord1.longitude) * Math.PI / 180;
//                     const a = Math.sin(dLat / 2) ** 2 +
//                         Math.cos(coord1.latitude * Math.PI / 180) *
//                         Math.cos(coord2.latitude * Math.PI / 180) *
//                         Math.sin(dLng / 2) ** 2;
//                     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//                     return R * c;
//                 }

//                 const distance = calcDistance(socket.userLocation, clientSocket.userLocation);

//                 clientSocket.emit("rideAccepted", {
//                     driverId: data.user._id,
//                     driverName: data.user.fullName,
//                     driverLocation: socket.userLocation,
//                     distance: distance.toFixed(2)
//                 });

//                 socket.emit("responseSent", { message: "✅ أرسلت موافقة للعميل" });

//             } else {
//                 clientSocket.emit("rideRejected", {
//                     driverId: data.user._id,
//                     driverName: data.user.fullName
//                 });

//                 socket.emit("responseSent", { message: "✅ أرسلت رفض للعميل" });
//             }

//         } catch (err) {
//             console.error("Error in rideResponse:", err);
//             socket.emit("socketErrorResponse", { message: "❌ خطأ أثناء إرسال رد الطلب" });
//         }
//     });
// };






export const rideResponse = (socket) => {
    socket.on("rideResponse", async ({ clientId, accepted, driverLocation, rideId }) => {
        try {
            const { data } = await authenticationSocket({ socket });
            if (!data.valid) return socket.emit("socketErrorResponse", data);

            const io = getIo();

            if (driverLocation) {
                socket.userLocation = driverLocation;
            }

            const clientSocket = Array.from(io.sockets.sockets.values())
                .find(s => s.userId === clientId);

            if (!clientSocket) {
                return socket.emit("socketErrorResponse", { message: "❌ العميل غير متصل" });
            }

            if (accepted) {
                socket.currentClientId = clientId;

                if (!socket.userLocation) {
                    return socket.emit("socketErrorResponse", { message: "❌ لازم تبعت موقعك الأول" });
                }
                if (!clientSocket.userLocation) {
                    return socket.emit("socketErrorResponse", { message: "❌ العميل لم يرسل موقعه" });
                }

                // ✅ تحديث حالة الرحلة إلى DONE
                await rideSchema.findByIdAndUpdate(rideId, { status: "DONE" });

                function calcDistance(coord1, coord2) {
                    const R = 6371;
                    const dLat = (coord2.latitude - coord1.latitude) * Math.PI / 180;
                    const dLng = (coord2.longitude - coord1.longitude) * Math.PI / 180;
                    const a = Math.sin(dLat / 2) ** 2 +
                        Math.cos(coord1.latitude * Math.PI / 180) *
                        Math.cos(coord2.latitude * Math.PI / 180) *
                        Math.sin(dLng / 2) ** 2;
                    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                    return R * c;
                }

                const distance = calcDistance(socket.userLocation, clientSocket.userLocation);

                clientSocket.emit("rideAccepted", {
                    rideId,
                    driverId: data.user._id,
                    driverName: data.user.fullName,
                    driverLocation: socket.userLocation,
                    distance: distance.toFixed(2)
                });

                socket.emit("responseSent", { message: "✅ أرسلت موافقة للعميل" });

            } else {
                // ❌ رفض الرحلة
                await rideSchema.findByIdAndUpdate(rideId, { status: "CANCELLED" });

                clientSocket.emit("rideRejected", {
                    rideId,
                    driverId: data.user._id,
                    driverName: data.user.fullName
                });

                socket.emit("responseSent", { message: "✅ أرسلت رفض للعميل" });
            }

        } catch (err) {
            console.error("Error in rideResponse:", err);
            socket.emit("socketErrorResponse", { message: "❌ خطأ أثناء إرسال رد الطلب" });
        }
    });
};
   
