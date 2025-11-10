import ChatModel from "../../../DB/models/chaatmodel.js";
import Usermodel, { scketConnections } from "../../../DB/models/User.model.js";
import { authenticationSocket } from "../../../middlewere/auth.socket.middlewere.js";
import * as dbservice from "../../../DB/dbservice.js"
import mongoose from 'mongoose';
import { getIo } from "../chat.socket.controller.js";
import rideSchema from "../../../DB/models/rideSchema.js";
import dotenv from "dotenv";

dotenv.config();
import fs from 'fs';

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



















import haversine from "haversine-distance";
import { OrderModel } from "../../../DB/models/orderSchema.model.js";
import { OrderModellllll } from "../../../DB/models/customItemSchemaorder.js";
import { NotificationModell } from "../../../DB/models/notificationSchema.js";
; // سوبر ماركت


// export const orderStatusUpdate = (socket) => {
//     socket.on("orderStatusUpdate", async ({ orderId }) => {
//         try {
           
//             const { data } = await authenticationSocket({ socket });
//             if (!data.valid) {
//                 return socket.emit("socketErrorResponse", data);
//             }

//             if (!orderId) {
//                 return socket.emit("socketErrorResponse", {
//                     message: "❌ مطلوب إرسال orderId"
//                 });
//             }

//             let order = null;
//             let type = null;

//             // ✅ أولاً: جرب تجيب الطلب من المطاعم
//             order = await OrderModel.findByIdAndUpdate(
//                 orderId,
//                 { status: "accepted" },
//                 { new: true }
//             ).populate("restaurant createdBy");

//             if (order) {
//                 type = "restaurant";
//             } else {
//                 // ✅ لو مش مطعم، جرب السوبر ماركت
//                 order = await OrderModellllll.findByIdAndUpdate(
//                     orderId,
//                     { status: "accepted" },
//                     { new: true }
//                 )
//                     .populate("supermarket user")
//                     .populate("products.product");

//                 if (order) {
//                     type = "supermarket";
//                 }
//             }

//             if (!order) {
//                 return socket.emit("socketErrorResponse", {
//                     message: "❌ الطلب غير موجود"
//                 });
//             }

//             // ✅ جِب كل المستخدمين اللي serviceType = Delivery
//             const deliveryUsers = await Usermodel.find({ serviceType: "Delivery" });

//             const io = getIo();

//             // ✅ احسب المسافة لكل دليفري وابعتله إشعار بالطلب
//             deliveryUsers.forEach((driver) => {
//                 if (!driver.location || !driver.location.coordinates) return;

//                 const driverCoords = {
//                     latitude: driver.location.coordinates[1],
//                     longitude: driver.location.coordinates[0]
//                 };

//                 let distToClient = 0;
//                 let distToVendor = 0;

//                 if (type === "restaurant") {
//                     distToClient = haversine(driverCoords, {
//                         latitude: order.userLocation.latitude,
//                         longitude: order.userLocation.longitude
//                     }) / 1000;

//                     distToVendor = haversine(driverCoords, {
//                         latitude: order.restaurantLocation.latitude,
//                         longitude: order.restaurantLocation.longitude
//                     }) / 1000;
//                 } else {
//                     distToClient = haversine(driverCoords, {
//                         latitude: order.userLocationLink2.latitude,
//                         longitude: order.userLocationLink2.longitude
//                     }) / 1000;

//                     distToVendor = haversine(driverCoords, {
//                         latitude: order.supermarketLocationLink2.latitude,
//                         longitude: order.supermarketLocationLink2.longitude
//                     }) / 1000;
//                 }

//                 // ✅ ابعت إشعار لحظي لكل دليفري متصل
//                 const driverSocket = Array.from(io.sockets.sockets.values())
//                     .find(s => s.userId === driver._id.toString());

//                 if (driverSocket) {
//                     driverSocket.emit("newAcceptedOrder", {
//                         orderId: order._id,
//                         type,
//                         status: order.status,
//                         client: type === "restaurant" ? order.createdBy : order.user,
//                         vendor: type === "restaurant" ? order.restaurant : order.supermarket,
//                         products: type === "restaurant"
//                             ? order.products
//                             : order.products.map(p => ({
//                                 name: p.product?.name,
//                                 price: p.product?.price,
//                                 quantity: p.quantity
//                             })),
//                         customItems: order.customItems || [],
//                         totalPrice: order.totalPrice,       // ✅ إجمالي المنتجات
//                         deliveryPrice: order.deliveryPrice, // ✅ سعر التوصيل
//                         finalPrice: order.finalPrice,
//                         addressText: order.addressText,
//                         clientLocationLink: type === "restaurant"
//                             ? order.userLocation?.link
//                             : order.userLocationLink,

//                         vendorLocationLink: type === "restaurant"
//                             ? order.restaurantLocation?.link
//                             : order.supermarketLocationLink,

//                         distanceToClient: distToClient.toFixed(2) + " km",
//                         distanceToVendor: distToVendor.toFixed(2) + " km"
//                     });
//                 }
//             });

//             // ✅ رجع رد للي عمل التحديث
//             socket.emit("orderStatusUpdated", {
//                 message: "✅ تم تحديث حالة الطلب وإرسال إشعارات للدليفري",
//                 order
//             });

//         } catch (error) {
//             console.error("Error in orderStatusUpdate:", error);
//             socket.emit("socketErrorResponse", {
//                 message: "❌ حدث خطأ أثناء تحديث حالة الطلب"
//             });
//         }
//     });
// };

// export const orderStatusUpdate = (socket) => {
//     socket.on("orderStatusUpdate", async ({ orderId }) => {
//         try {
//             // ✅ تحقق من المستخدم
//             const { data } = await authenticationSocket({ socket });
//             if (!data.valid) {
//                 return socket.emit("socketErrorResponse", data);
//             }

//             if (!orderId) {
//                 return socket.emit("socketErrorResponse", {
//                     message: "❌ مطلوب إرسال orderId"
//                 });
//             }

//             let order = null;
//             let type = null;

//             // ✅ أولاً: جرب تجيب الطلب من المطاعم
//             order = await OrderModel.findByIdAndUpdate(
//                 orderId,
//                 { status: "accepted" },
//                 { new: true }
//             ).populate("restaurant createdBy");

//             if (order) {
//                 type = "restaurant";
//             } else {
//                 // ✅ لو مش مطعم، جرب السوبر ماركت
//                 order = await OrderModellllll.findByIdAndUpdate(
//                     orderId,
//                     { status: "accepted" },
//                     { new: true }
//                 )
//                     .populate("supermarket user")
//                     .populate("products.product");

//                 if (order) {
//                     type = "supermarket";
//                 }
//             }

//             if (!order) {
//                 return socket.emit("socketErrorResponse", {
//                     message: "❌ الطلب غير موجود"
//                 });
//             }

//             // ✅ جِب كل المستخدمين اللي serviceType = Delivery
//             const deliveryUsers = await Usermodel.find({ serviceType: "Delivery" });

//             const io = getIo();

//             // ✅ احسب المسافة لكل دليفري وابعتله إشعار بالطلب
//             deliveryUsers.forEach((driver) => {
//                 if (!driver.location || !driver.location.coordinates) return;

//                 const driverCoords = {
//                     latitude: driver.location.coordinates[1],
//                     longitude: driver.location.coordinates[0]
//                 };

//                 let distToClient = 0;
//                 let distToVendor = 0;

//                 if (type === "restaurant") {
//                     distToClient = haversine(driverCoords, {
//                         latitude: order.userLocation.latitude,
//                         longitude: order.userLocation.longitude
//                     }) / 1000;

//                     distToVendor = haversine(driverCoords, {
//                         latitude: order.restaurantLocation.latitude,
//                         longitude: order.restaurantLocation.longitude
//                     }) / 1000;
//                 } else {
//                     distToClient = haversine(driverCoords, {
//                         latitude: order.userLocationLink2.latitude,
//                         longitude: order.userLocationLink2.longitude
//                     }) / 1000;

//                     distToVendor = haversine(driverCoords, {
//                         latitude: order.supermarketLocationLink2.latitude,
//                         longitude: order.supermarketLocationLink2.longitude
//                     }) / 1000;
//                 }

//                 // ✅ ابعت إشعار لحظي لكل دليفري متصل
//                 const driverSocket = Array.from(io.sockets.sockets.values())
//                     .find(s => s.userId === driver._id.toString());

//                 if (driverSocket) {
//                     driverSocket.emit("newAcceptedOrder", {
//                         orderId: order._id,
//                         type,
//                         status: order.status,
//                         client: type === "restaurant" ? order.createdBy : order.user,
//                         vendor: type === "restaurant" ? order.restaurant : order.supermarket,
//                         products: type === "restaurant"
//                             ? order.products
//                             : order.products.map(p => ({
//                                 name: p.product?.name,
//                                 price: p.product?.price,
//                                 quantity: p.quantity
//                             })),
//                         customItems: order.customItems || [],
//                         totalPrice: order.totalPrice,       // ✅ إجمالي المنتجات
//                         deliveryPrice: order.deliveryPrice, // ✅ سعر التوصيل
//                         finalPrice: order.finalPrice,
//                         addressText: order.addressText,
//                         clientLocationLink: type === "restaurant"
//                             ? order.userLocation?.link
//                             : order.userLocationLink,

//                         vendorLocationLink: type === "restaurant"
//                             ? order.restaurantLocation?.link
//                             : order.supermarketLocationLink,

//                         distanceToClient: distToClient.toFixed(2) + " km",
//                         distanceToVendor: distToVendor.toFixed(2) + " km"
//                     });
//                 }
//             });

//             // ✅ رجع رد للي عمل التحديث
//             socket.emit("orderStatusUpdated", {
//                 message: "✅ تم تحديث حالة الطلب وإرسال إشعارات للدليفري",
//                 order
//             });

//         } catch (error) {
//             console.error("Error in orderStatusUpdate:", error);
//             socket.emit("socketErrorResponse", {
//                 message: "❌ حدث خطأ أثناء تحديث حالة الطلب"
//             });
//         }
//     });

//     // ✅ دليفري يقبل الطلب
//     socket.on("acceptOrder", async ({ orderId }) => {
//         try {
//             const { data } = await authenticationSocket({ socket });
//             if (!data.valid) return socket.emit("socketErrorResponse", data);

//             let order = await OrderModel.findById(orderId)
//                 .populate("createdBy restaurant");

//             let type = "restaurant";

//             if (!order) {
//                 order = await OrderModellllll.findById(orderId)
//                     .populate("supermarket user products.product");
//                 type = "supermarket";
//             }

//             if (!order) return socket.emit("socketErrorResponse", { message: "❌ الطلب غير موجود" });

//             if (order.status === "on_the_way") {
//                 return socket.emit("socketErrorResponse", { message: "❌ الطلب اتاخد بالفعل من دليفري آخر" });
//             }

//             // ✅ اول دليفري يقبل
//             order.status = "on_the_way";
//             order.assignedDriver = data.user._id;
//             await order.save();

//             // ابعت إشعار للعميل
//             const io = getIo();
//             const clientId = type === "restaurant" ? order.createdBy?._id : order.user?._id;
//             const clientSocket = Array.from(io.sockets.sockets.values())
//                 .find(s => s.userId === clientId?.toString());

//             if (clientSocket) {
//                 clientSocket.emit("orderOnTheWay", {
//                     message: "🚚 طلبك في الطريق مع الدليفري",
//                     driver: {
//                         fullName: data.user.fullName,
//                         phone: data.user.phone,
//                         profiePicture: data.user.profiePicture
//                     },
//                     orderId: order._id
//                 });
//             }

//             socket.emit("orderAccepted", { message: "✅ قبلت الطلب", orderId: order._id });

//         } catch (err) {
//             console.error("Error in acceptOrder:", err);
//             socket.emit("socketErrorResponse", { message: "❌ حدث خطأ أثناء قبول الطلب" });
//         }
//     });

//     // ✅ دليفري وصل الطلب
//     socket.on("markOrderDelivered", async ({ orderId }) => {
//         try {
//             const { data } = await authenticationSocket({ socket });
//             if (!data.valid) return socket.emit("socketErrorResponse", data);

//             let order = await OrderModel.findById(orderId).populate("createdBy");

//             let type = "restaurant";

//             if (!order) {
//                 order = await OrderModellllll.findById(orderId).populate("user");
//                 type = "supermarket";
//             }

//             if (!order) return socket.emit("socketErrorResponse", { message: "❌ الطلب غير موجود" });

//             if (order.assignedDriver?.toString() !== data.user._id.toString()) {
//                 return socket.emit("socketErrorResponse", { message: "❌ مش مسموحلك تسلم الطلب ده" });
//             }

//             order.status = "delivered";
//             await order.save();

//             const io = getIo();
//             const clientId = type === "restaurant" ? order.createdBy?._id : order.user?._id;
//             const clientSocket = Array.from(io.sockets.sockets.values())
//                 .find(s => s.userId === clientId?.toString());

//             if (clientSocket) {
//                 clientSocket.emit("orderDelivered", {
//                     message: "✅ تم توصيل الطلب بنجاح، نرجو استلامه",
//                     orderId: order._id
//                 });
//             }

//             socket.emit("orderMarkedDelivered", { message: "✅ علمت الطلب كمُسلم", orderId: order._id });

//         } catch (err) {
//             console.error("Error in markOrderDelivered:", err);
//             socket.emit("socketErrorResponse", { message: "❌ حدث خطأ أثناء تحديث حالة التوصيل" });
//         }
//     });
// // };

// orderStatusUpdate.js
import admin from 'firebase-admin';
import { RideRequestModel } from "../../../DB/models/rideRequestSchema.model.js";

export const orderStatusUpdate = (socket) => {
    socket.on("orderStatusUpdate", async ({ orderId }) => {
        try {
            const { data } = await authenticationSocket({ socket });
            console.log("📌 orderStatusUpdate -> user data:", data);

            if (!data.valid) {
                console.log("❌ المستخدم غير مصرح");
                return socket.emit("socketErrorResponse", data);
            }

            if (!orderId) {
                console.log("❌ orderId مش موجود");
                return socket.emit("socketErrorResponse", {
                    message: "❌ مطلوب إرسال orderId"
                });
            }

            let order = null;
            let type = null;

            order = await OrderModel.findByIdAndUpdate(
                orderId,
                { status: "accepted" },
                { new: true }
            ).populate("restaurant createdBy");
            console.log("🔎 Order from restaurant:", order);

            if (order) {
                type = "restaurant";
            } else {
                order = await OrderModellllll.findByIdAndUpdate(
                    orderId,
                    { status: "accepted" },
                    { new: true }
                )
                    .populate("supermarket user")
                    .populate("products.product");

                console.log("🔎 Order from supermarket:", order);
                if (order) type = "supermarket";
            }

            if (!order) {
                console.log("❌ الطلب مش موجود");
                return socket.emit("socketErrorResponse", {
                    message: "❌ الطلب غير موجود"
                });
            }

            const deliveryUsers = await Usermodel.find({ serviceType: "Delivery" });
            console.log("🚚 Delivery users count:", deliveryUsers.length);

            const io = getIo();

            deliveryUsers.forEach((driver) => {
                console.log("👤 Checking driver:", driver.fullName, driver._id);
                if (!driver.location || !driver.location.coordinates) {
                    console.log("⚠️ السواق ملوش إحداثيات");
                    return;
                }

                const driverCoords = {
                    latitude: driver.location.coordinates[1],
                    longitude: driver.location.coordinates[0]
                };

                let distToClient = 0;
                let distToVendor = 0;

                if (type === "restaurant") {
                    distToClient = haversine(driverCoords, {
                        latitude: order.userLocation?.latitude,
                        longitude: order.userLocation?.longitude
                    }) / 1000;

                    distToVendor = haversine(driverCoords, {
                        latitude: order.restaurantLocation?.latitude,
                        longitude: order.restaurantLocation?.longitude
                    }) / 1000;
                } else {
                    distToClient = haversine(driverCoords, {
                        latitude: order.userLocationLink2?.latitude,
                        longitude: order.userLocationLink2?.longitude
                    }) / 1000;

                    distToVendor = haversine(driverCoords, {
                        latitude: order.supermarketLocationLink2?.latitude,
                        longitude: order.supermarketLocationLink2?.longitude
                    }) / 1000;
                }

                console.log(`📏 مسافة للسواق ${driver.fullName}: للعميل=${distToClient}km | للبائع=${distToVendor}km`);

                const driverSocket = Array.from(io.sockets.sockets.values())
                    .find(s => s.userId === driver._id.toString());

                if (driverSocket) {
                    console.log("📡 إرسال order للسواق:", driver.fullName);
                    driverSocket.emit("newAcceptedOrder", {
                        orderId: order._id,
                        type,
                        status: order.status,
                        client: type === "restaurant" ? order.createdBy : order.user,
                        vendor: type === "restaurant" ? order.restaurant : order.supermarket,
                        products: type === "restaurant"
                            ? order.products
                            : order.products.map(p => ({
                                name: p.product?.name,
                                price: p.product?.price,
                                quantity: p.quantity
                            })),
                        customItems: order.customItems || [],
                        totalPrice: order.totalPrice,
                        deliveryPrice: order.deliveryPrice,
                        finalPrice: order.finalPrice,
                        Invoice: order.Invoice,
                        addressText: order.addressText,

                        // ✅ مواقع العميل
                        clientLocation: type === "restaurant"
                            ? {
                                link: order.userLocation?.link,
                                latitude: order.userLocation?.latitude,
                                longitude: order.userLocation?.longitude
                            }
                            : {
                                link: order.userLocationLink,
                                latitude: order.userLocationLink2?.latitude,
                                longitude: order.userLocationLink2?.longitude
                            },

                        // ✅ مواقع المطعم/السوبرماركت
                        vendorLocation: type === "restaurant"
                            ? {
                                link: order.restaurantLocation?.link,
                                latitude: order.restaurantLocation?.latitude,
                                longitude: order.restaurantLocation?.longitude
                            }
                            : {
                                link: order.supermarketLocationLink,
                                latitude: order.supermarketLocationLink2?.latitude,
                                longitude: order.supermarketLocationLink2?.longitude
                            },

                        distanceToClient: distToClient.toFixed(2) + " km",
                        distanceToVendor: distToVendor.toFixed(2) + " km"
                    });

                } else {
                    console.log("⚠️ السواق مش متصل:", driver.fullName);
                }
            });



            socket.on("cancelOrderByDriver", async ({ orderId, reason }) => {
                try {
                    const { data } = await authenticationSocket({ socket });
                    console.log("📌 cancelOrderByDriver -> user data:", data);

                    if (!data.valid)
                        return socket.emit("socketErrorResponse", data);

                    if (!orderId || !reason) {
                        return socket.emit("socketErrorResponse", {
                            message: "❌ مطلوب إرسال orderId وسبب الإلغاء"
                        });
                    }

                    let order = await OrderModel.findById(orderId)
                        .populate("createdBy restaurant");
                    let type = "restaurant";

                    if (!order) {
                        order = await OrderModellllll.findById(orderId)
                            .populate("supermarket user products.product");
                        type = "supermarket";
                    }

                    console.log("🔎 Order found in cancelOrderByDriver:", order);

                    if (!order)
                        return socket.emit("socketErrorResponse", { message: "❌ الطلب غير موجود" });

                    if (order.assignedDriver?.toString() !== data.user._id.toString()) {
                        console.log("⚠️ هذا الدليفري غير معين لهذا الطلب");
                        return socket.emit("socketErrorResponse", { message: "❌ غير مصرح لك بإلغاء هذا الطلب" });
                    }

                    // ✅ تحديث حالة الطلب وإزالة الدليفري
                    order.status = "accepted";
                    order.assignedDriver = null;
                    await order.save();
                    console.log("✅ order updated to accepted (بعد الإلغاء):", order._id);

                    // 📩 إرسال إشعار للعميل
                    const clientId = type === "restaurant" ? order.createdBy?._id : order.user?._id;
                    const clientUser = await Usermodel.findById(clientId);
                    console.log("👤 clientUser:", clientUser?.fullName, "fcmToken:", clientUser?.fcmToken);

                    if (clientUser?.fcmToken) {
                        try {
                            const response = await admin.messaging().send({
                                notification: {
                                    title: "⚠️ تم إلغاء الطلب من الدليفري",
                                    body: `قام الدليفري بإلغاء الطلب. السبب: ${reason}`
                                },
                                data: {
                                    orderId: order._id.toString(),
                                    driverId: data.user._id.toString(),
                                    reason
                                },
                                token: clientUser.fcmToken,
                            });
                            console.log("✅ إشعار FCM اتبعت:", response);

                            const notif = await NotificationModell.create({
                                order: order._id,
                                user: clientId,
                                driver: data.user._id,
                                title: "⚠️ تم إلغاء الطلب من الدليفري",
                                body: `قام الدليفري بإلغاء الطلب. السبب: ${reason}`,
                                deviceToken: clientUser.fcmToken
                            });
                            console.log("✅ إشعار اتخزن في DB:", notif._id);

                        } catch (err) {
                            console.error("❌ خطأ أثناء إرسال إشعار الإلغاء:", err);
                        }
                    } else {
                        console.log("⚠️ العميل ملوش fcmToken");
                    }

                    // 🔁 إرسال رد للدليفري
                    socket.emit("orderCanceledByDriver", {
                        message: "✅ تم إلغاء الطلب وإرسال الإشعار للعميل",
                        orderId: order._id
                    });

                } catch (err) {
                    console.error("❌ Error in cancelOrderByDriver:", err);
                    socket.emit("socketErrorResponse", {
                        message: "❌ حدث خطأ أثناء إلغاء الطلب"
                    });
                }
            });



            socket.on("orderPicked", async ({ orderId }) => {
                try {
                    const { data } = await authenticationSocket({ socket });
                    console.log("📌 orderPicked -> user data:", data);

                    if (!data.valid)
                        return socket.emit("socketErrorResponse", data);

                    let order = await OrderModel.findById(orderId)
                        .populate("createdBy restaurant");
                    let type = "restaurant";

                    if (!order) {
                        order = await OrderModellllll.findById(orderId)
                            .populate("supermarket user products.product");
                        type = "supermarket";
                    }

                    console.log("🔎 Order found in orderPicked:", order);

                    if (!order)
                        return socket.emit("socketErrorResponse", { message: "❌ الطلب غير موجود" });

                    if (order.assignedDriver?.toString() !== data.user._id.toString()) {
                        console.log("⚠️ هذا الدليفري غير معين لهذا الطلب");
                        return socket.emit("socketErrorResponse", { message: "❌ غير مصرح لك بأخذ الطلب" });
                    }

                    // ✅ تحديث حالة الطلب
                    order.status = "picked_up";
                    await order.save();
                    console.log("✅ order updated to picked_up:", order._id);

                    // 📩 إرسال إشعار للعميل
                    const clientId = type === "restaurant" ? order.createdBy?._id : order.user?._id;
                    const clientUser = await Usermodel.findById(clientId);
                    console.log("👤 clientUser:", clientUser?.fullName, "fcmToken:", clientUser?.fcmToken);

                    if (clientUser?.fcmToken) {
                        try {
                            const response = await admin.messaging().send({
                                notification: {
                                    title: "🍔 تم استلام طلبك من المطعم",
                                    body: "قام الدليفري باستلام طلبك وهو في الطريق إليك 🚗"
                                },
                                data: {
                                    orderId: order._id.toString(),
                                    driverId: data.user._id.toString()
                                },
                                token: clientUser.fcmToken,
                            });
                            console.log("✅ إشعار FCM اتبعت:", response);

                            // ✅ تخزين الإشعار في قاعدة البيانات
                            const notif = await NotificationModell.create({
                                order: order._id,
                                user: clientId,
                                driver: data.user._id,
                                title: "🍔 تم استلام طلبك من المطعم",
                                body: "قام الدليفري باستلام طلبك وهو في الطريق إليك 🚗",
                                deviceToken: clientUser.fcmToken
                            });
                            console.log("✅ إشعار اتخزن في DB:", notif._id);

                        } catch (err) {
                            console.error("❌ خطأ أثناء إرسال إشعار orderPicked:", err);
                        }
                    } else {
                        console.log("⚠️ العميل ملوش fcmToken");
                    }

                    // 🔁 إرسال رد للدليفري
                    socket.emit("orderPickedConfirmed", {
                        message: "✅ تم تأكيد استلام الطلب من البائع",
                        orderId: order._id
                    });

                } catch (err) {
                    console.error("❌ Error in orderPicked:", err);
                    socket.emit("socketErrorResponse", { message: "❌ حدث خطأ أثناء تحديث حالة الطلب إلى مستلم" });
                }
            });




            socket.emit("orderStatusUpdated", {
                message: "✅ تم تحديث حالة الطلب وإرسال إشعارات للدليفري",
                order
            });

        } catch (error) {
            console.error("❌ Error in orderStatusUpdate:", error);
            socket.emit("socketErrorResponse", {
                message: "❌ حدث خطأ أثناء تحديث حالة الطلب"
            });
        }



        
    });



    

    socket.on("acceptOrder", async ({ orderId }) => {
        try {
            const { data } = await authenticationSocket({ socket });
            console.log("📌 acceptOrder -> user data:", data);

            if (!data.valid) return socket.emit("socketErrorResponse", data);

            let order = await OrderModel.findById(orderId)
                .populate("createdBy restaurant");
            let type = "restaurant";

            if (!order) {
                order = await OrderModellllll.findById(orderId)
                    .populate("supermarket user products.product");
                type = "supermarket";
            }

            console.log("🔎 Order found in acceptOrder:", order);

            if (!order) return socket.emit("socketErrorResponse", { message: "❌ الطلب غير موجود" });

            if (order.status === "on_the_way") {
                console.log("⚠️ الطلب متاخد بالفعل");
                return socket.emit("socketErrorResponse", { message: "❌ الطلب اتاخد بالفعل من دليفري آخر" });
            }

            order.status = "on_the_way";
            order.assignedDriver = data.user._id;
            await order.save();
            console.log("✅ order saved on_the_way:", order._id);

            const clientId = type === "restaurant" ? order.createdBy?._id : order.user?._id;
            const clientUser = await Usermodel.findById(clientId);
            console.log("👤 clientUser:", clientUser?.fullName, "fcmToken:", clientUser?.fcmToken);

            if (clientUser?.fcmToken) {
                try {
                    const response = await admin.messaging().send({
                        notification: {
                            title: "🚚 الطلب في الطريق",
                            body: "تم قبول طلبك من الدليفري وهو في الطريق الآن"
                        },
                        data: {
                            orderId: order._id.toString(),
                            driverId: data.user._id.toString()
                        },
                        token: clientUser.fcmToken,
                    });
                    console.log("✅ إشعار FCM اتبعت:", response);

                    const notif = await NotificationModell.create({
                        order: order._id,
                        user: clientId,
                        driver: data.user._id,
                        title: "🚚 الطلب في الطريق",
                        body: "تم قبول طلبك من الدليفري وهو في الطريق الآن",
                        deviceToken: clientUser.fcmToken
                    });
                    console.log("✅ إشعار اتخزن في DB:", notif._id);

                } catch (err) {
                    console.error("❌ خطأ أثناء إرسال الإشعار:", err);
                }
            } else {
                console.log("⚠️ العميل ملوش fcmToken");
            }

            socket.emit("orderAccepted", { message: "✅ قبلت الطلب", orderId: order._id });

        } catch (err) {
            console.error("❌ Error in acceptOrder:", err);
            socket.emit("socketErrorResponse", { message: "❌ حدث خطأ أثناء قبول الطلب" });
        }
    });

    socket.on("markOrderDelivered", async ({ orderId }) => {
        try {
            const { data } = await authenticationSocket({ socket });
            console.log("📌 markOrderDelivered -> user data:", data);

            if (!data.valid) return socket.emit("socketErrorResponse", data);

            let order = await OrderModel.findById(orderId).populate("createdBy");
            let type = "restaurant";

            if (!order) {
                order = await OrderModellllll.findById(orderId).populate("user");
                type = "supermarket";
            }

            console.log("🔎 Order found in markOrderDelivered:", order);

            if (!order) return socket.emit("socketErrorResponse", { message: "❌ الطلب غير موجود" });

            if (order.assignedDriver?.toString() !== data.user._id.toString()) {
                console.log("⚠️ الدليفري مش هو اللي متعين للطلب");
                return socket.emit("socketErrorResponse", { message: "❌ مش مسموحلك تسلم الطلب ده" });
            }

            order.status = "delivered";
            await order.save();
            console.log("✅ order saved delivered:", order._id);

            const clientId = type === "restaurant" ? order.createdBy?._id : order.user?._id;
            const clientUser = await Usermodel.findById(clientId);
            console.log("👤 clientUser:", clientUser?.fullName, "fcmToken:", clientUser?.fcmToken);

            if (clientUser?.fcmToken) {
                try {
                    const response = await admin.messaging().send({
                        notification: {
                            title: "✅ تم التوصيل",
                            body: "تم توصيل طلبك بنجاح"
                        },
                        data: {
                            orderId: order._id.toString(),
                            driverId: data.user._id.toString()
                        },
                        token: clientUser.fcmToken,
                    });
                    console.log("✅ إشعار FCM اتبعت:", response);

                    const notif = await NotificationModell.create({
                        order: order._id,
                        user: clientId,
                        driver: data.user._id,
                        title: "✅ تم التوصيل",
                        body: "تم توصيل طلبك بنجاح",
                        deviceToken: clientUser.fcmToken
                    });
                    console.log("✅ إشعار اتخزن في DB:", notif._id);

                } catch (err) {
                    console.error("❌ خطأ أثناء إرسال إشعار التوصيل:", err);
                }
            } else {
                console.log("⚠️ العميل ملوش fcmToken");
            }

            socket.emit("orderMarkedDelivered", { message: "✅ علمت الطلب كمُسلم", orderId: order._id });

        } catch (err) {
            console.error("❌ Error in markOrderDelivered:", err);
            socket.emit("socketErrorResponse", { message: "❌ حدث خطأ أثناء تحديث حالة التوصيل" });
        }
    });
};


















// export const userLocationUpdate = (socket) => {
//     socket.on("userLocationUpdate", async ({ longitude, latitude }) => {
//         try {
//             const { data } = await authenticationSocket({ socket });
//             if (!data.valid) {
//                 return socket.emit("socketErrorResponse", data);
//             }

//             if (!longitude || !latitude) {
//                 return socket.emit("socketErrorResponse", {
//                     message: "❌ مطلوب إرسال خط الطول والعرض"
//                 });
//             }

//             // 📝 خزّن موقع العميل في الـ socket
//             socket.userLocation = { longitude, latitude };

//             // 🔍 رجّعله السواقين القريبين أول مرة
//             const drivers = await Usermodel.aggregate([
//                 {
//                     $geoNear: {
//                         near: { type: "Point", coordinates: [longitude, latitude] },
//                         distanceField: "distance",
//                         spherical: true,
//                         maxDistance: 1000000000
//                     }
//                 },
//                 { $match: { serviceType: "Driver" } },
//                 {
//                     $project: {
//                         fullName: 1,
//                         kiloPrice: 1,   // ✅ سعر الكيلو
//                         "profilePicture.secure_url": 1, // ✅ الصورة
//                         // "profilePicture.secure_url": 1,
//                         distance: { $divide: ["$distance", 1000] }
//                     }
//                 }
//             ]);

//             socket.emit("nearbyDrivers", drivers);

//         } catch (err) {
//             console.error("Error in userLocationUpdate:", err);
//             socket.emit("socketErrorResponse", { message: "❌ خطأ داخلي" });
//         }
//     });
// };

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
                        maxDistance: 1000000000
                    }
                },
                { $match: { serviceType: "Driver", isOnline: true } }, // ✅ لازم يكون Driver وأونلاين
                {
                    $project: {
                        fullName: 1,
                        kiloPrice: 1,   // ✅ سعر الكيلو
                        "profilePicture.secure_url": 1, // ✅ الصورة
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

            await RideRequestModel.create({
                rideId: newRide._id,
                clientId: data.user._id,
                clientName: data.user.fullName,
                pickup,
                dropoff,
                driverId: driverId,
                price,
                status: "pending"
            })
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



            // ✅ إرسال إشعار FCM للسواق
            try {
                const driver = await Usermodel.findById(driverId).select("fcmToken fullName");
                if (driver?.fcmToken) {
                    await admin.messaging().send({
                        notification: {
                            title: "🚖 طلب مشوار جديد",
                            body: `📍 ${data.user.fullName} طلب رحلة جديدة`,
                        },
                        data: {
                            rideId: newRide._id.toString(),
                            clientId: data.user._id.toString(),
                            driverId: driverId.toString(),
                            createdAt: newRide.createdAt.toISOString(),
                        },
                        token: driver.fcmToken,
                    });

                    // 📝 تخزين الإشعار في الداتابيز
                    await NotificationModel.create({
                        user: driverId,
                        ride: newRide._id,
                        title: "🚖 طلب مشوار جديد",
                        body: `📍 ${data.user.fullName} طلب رحلة جديدة`,
                        fcmToken: driver.fcmToken,
                    });
                } else {
                    console.log("⚠️ السواق مش معاه fcmToken");
                }
            } catch (error) {
                console.error("❌ فشل إرسال الإشعار:", error);
            }

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

                // ✅ تحديث حالة الرحلة إلى DONE (تم القبول كبداية)
                await rideSchema.findByIdAndUpdate(rideId, { status: "ACCEPTED" });

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

                // 🔔 إشعار لحظي للعميل بقبول الرحلة
                clientSocket.emit("rideAccepted", {
                    rideId,
                    driverId: data.user._id,
                    driverName: data.user.fullName,
                    driverLocation: socket.userLocation,
                    distance: distance.toFixed(2)
                });

                // ✅ إرسال إشعار FCM للعميل بقبول الرحلة
                try {
                    const client = await Usermodel.findById(clientId).select("fcmToken");
                    if (client?.fcmToken) {
                        await admin.messaging().send({
                            notification: {
                                title: "🚖 تم قبول رحلتك",
                                body: `${data.user.fullName} وافق على توصيلك 🚗`,
                            },
                            data: { rideId: rideId.toString(), status: "ACCEPTED" },
                            token: client.fcmToken,
                        });
                    }
                } catch (error) {
                    console.error("❌ فشل إرسال إشعار القبول:", error);
                }



                socket.emit("responseSent", { message: "✅ أرسلت موافقة للعميل", rideId });

            } else {
                // ❌ رفض الرحلة
                await rideSchema.findByIdAndUpdate(rideId, { status: "CANCELLED" });

                clientSocket.emit("rideRejected", {
                    rideId,
                    driverId: data.user._id,
                    driverName: data.user.fullName
                });

                // ✅ إرسال إشعار FCM للعميل برفض الرحلة
                try {
                    const client = await Usermodel.findById(clientId).select("fcmToken");
                    if (client?.fcmToken) {
                        await admin.messaging().send({
                            notification: {
                                title: "❌ تم رفض رحلتك",
                                body: `${data.user.fullName} اعتذر عن الرحلة.`,
                            },
                            data: { rideId: rideId.toString(), status: "REJECTED" },
                            token: client.fcmToken,
                        });
                    }
                } catch (error) {
                    console.error("❌ فشل إرسال إشعار الرفض:", error);
                }


                socket.emit("responseSent", { message: "✅ أرسلت رفض للعميل" });
            }

        } catch (err) {
            console.error("Error in rideResponse:", err);
            socket.emit("socketErrorResponse", { message: "❌ خطأ أثناء إرسال رد الطلب" });
        }
    });


    // 🧭 حدث عندما السائق يأخذ العميل (العميل دخل السيارة)
    socket.on("clientPicked", async ({ rideId }) => {
        try {
            const { data } = await authenticationSocket({ socket });
            if (!data.valid) return socket.emit("socketErrorResponse", data);

            const driver = data.user;
            const io = getIo();

            // 🔍 البحث عن الرحلة
            const ride = await rideSchema.findById(rideId);
            if (!ride) {
                return socket.emit("socketErrorResponse", { message: "❌ الرحلة غير موجودة" });
            }

            // ✅ تحديث الحالة إلى "GET_CLIENT"
            ride.status = "ongoing";
            await ride.save();

            // 🔍 جلب Socket العميل
            const clientSocket = Array.from(io.sockets.sockets.values())
                .find(s => s.userId?.toString() === ride.clientId.toString());

            // 🔔 إشعار لحظي للعميل عبر Socket
            if (clientSocket) {
                clientSocket.emit("rideStatusUpdate", {
                    rideId,
                    status: "ongoing",
                    message: "🚖 تم استقبالك في السيارة",
                });
            }

            // ✅ إرسال إشعار FCM للعميل
            try {
                const client = await Usermodel.findById(ride.clientId).select("fcmToken");
                if (client?.fcmToken) {
                    await admin.messaging().send({
                        notification: {
                            title: "🚖 تم استقبالك في السيارة",
                            body: `${driver.fullName} استقبلك في السيارة وبدأت الرحلة 🚗`,
                        },
                        data: { rideId: rideId.toString(), status: "GET_CLIENT" },
                        token: client.fcmToken,
                    });
                }
            } catch (error) {
                console.error("❌ فشل إرسال إشعار FCM عند استلام العميل:", error);
            }

            // 💾 تخزين الإشعار في قاعدة البيانات
            try {
                await NotificationModell.create({
                    userId: ride.clientId,
                    title: "🚖 تم استقبالك في السيارة",
                    body: `${driver.fullName} استقبلك وبدأت الرحلة.`,
                    type: "RIDE_ongoing",
                    data: { rideId, driverId: driver._id },
                });
            } catch (err) {
                console.error("⚠️ فشل تخزين إشعار ongoing:", err);
            }

            // ✅ تأكيد للسائق
            socket.emit("rideStatusUpdate", {
                rideId,
                status: "ongoingT",
                message: "✅ تم تحديث الحالة: العميل داخل السيارة",
            });

        } catch (err) {
            console.error("❌ Error in ongoing:", err);
            socket.emit("socketErrorResponse", { message: "❌ خطأ أثناء تحديث حالة العميل" });
        }
    });




    // 🚖 بدء الرحلة
    socket.on("startRide", async ({ rideId }) => {
        try {
            await rideSchema.findByIdAndUpdate(rideId, { status: "driver on the way" });

            const io = getIo();
            const ride = await rideSchema.findById(rideId);
            const clientSocket = Array.from(io.sockets.sockets.values())
                .find(s => s.userId?.toString() === ride.clientId.toString());

            if (clientSocket) {
                clientSocket.emit("rideStatusUpdate", { rideId, status: "driver on the way" });
            }
            // ✅ إرسال إشعار FCM للعميل ببدء الرحلة
            try {
                const client = await Usermodel.findById(ride.clientId).select("fcmToken");
                if (client?.fcmToken) {
                    await admin.messaging().send({
                        notification: {
                            title: "🚕 السواق في الطريق",
                            body: "سواقك بدأ التحرك وجاي في الطريق 🛣️",
                        },
                        data: { rideId: rideId.toString(), status: "STARTED" },
                        token: client.fcmToken,
                    });
                }
            } catch (error) {
                console.error("❌ فشل إرسال إشعار بدء الرحلة:", error);
            }


            socket.emit("rideStatusUpdate", { rideId, status: "driver on the way" });
        } catch (err) {
            console.error("Error in startRide:", err);
            socket.emit("socketErrorResponse", { message: "❌ خطأ أثناء بدء الرحلة" });
        }
    });

    // 🏁 إنهاء الرحلة
    socket.on("finishRide", async ({ rideId }) => {
        try {
            await rideSchema.findByIdAndUpdate(rideId, { status: "ongoing finished" });

            const io = getIo();
            const ride = await rideSchema.findById(rideId);
            const clientSocket = Array.from(io.sockets.sockets.values())
                .find(s => s.userId?.toString() === ride.clientId.toString());

            if (clientSocket) {
                clientSocket.emit("rideStatusUpdate", { rideId, status: "ongoing finished" });
            }
            // ✅ إرسال إشعار FCM للعميل بإنهاء الرحلة
            try {
                const client = await Usermodel.findById(ride.clientId).select("fcmToken");
                if (client?.fcmToken) {
                    await admin.messaging().send({
                        notification: {
                            title: "🏁 الرحلة انتهت",
                            body: "شكراً لاستخدامك خدمتنا 🚖 نتمنى لك يوماً سعيداً!",
                        },
                        data: { rideId: rideId.toString(), status: "FINISHED" },
                        token: client.fcmToken,
                    });
                }
            } catch (error) {
                console.error("❌ فشل إرسال إشعار إنهاء الرحلة:", error);
            }


            socket.emit("rideStatusUpdate", { rideId, status: "ongoing finished" });
        } catch (err) {
            console.error("Error in finishRide:", err);
            socket.emit("socketErrorResponse", { message: "❌ خطأ أثناء إنهاء الرحلة" });
        }
    });

    // ❌ إلغاء الرحلة من العميل
    // ❌ إلغاء الرحلة (من العميل أو السائق)
    socket.on("cancelRide", async ({ rideId, cancellationReason }) => {
        try {
            if (!cancellationReason || !cancellationReason.trim()) {
                return socket.emit("socketErrorResponse", { message: "❌ لازم تكتب سبب الإلغاء" });
            }

            const { data } = await authenticationSocket({ socket });
            if (!data.valid) return socket.emit("socketErrorResponse", data);

            const user = data.user;
            const io = getIo();

            // 🧩 البحث عن الرحلة
            const ride = await rideSchema.findById(rideId);
            if (!ride) {
                return socket.emit("socketErrorResponse", { message: "❌ الرحلة غير موجودة" });
            }

            // 🔄 تحديث حالة الرحلة
            ride.status = "CANCELLED";
            ride.cancellationReason = cancellationReason;
            ride.cancelledBy = user._id;
            await ride.save();

            // 📍 تحديد الطرف الآخر (العميل ↔ السائق)
            const isClient = ride.clientId.toString() === user._id.toString();
            const targetId = isClient ? ride.driverId : ride.clientId;
            const targetSocket = Array.from(io.sockets.sockets.values())
                .find(s => s.userId?.toString() === targetId.toString());

            // 📲 عنوان و نص الإشعار
            const title = isClient
                ? "🚫 العميل ألغى الرحلة"
                : "🚫 السائق ألغى الرحلة";

            const body = `${user.fullName} قام بإلغاء الرحلة. السبب: ${cancellationReason}`;

            // 🔔 إشعار Socket للطرف الآخر
            if (targetSocket) {
                targetSocket.emit("rideCancelled", {
                    rideId,
                    cancelledBy: user._id,
                    cancelledByName: user.fullName,
                    cancellationReason
                });
            }

            // ✅ إشعار للطرف المُلغي لتأكيد العملية
            socket.emit("rideStatusUpdate", {
                rideId,
                status: "CANCELLED",
                cancellationReason
            });

            // ✅ إرسال إشعار FCM للطرف الآخر
            try {
                const targetUser = await Usermodel.findById(targetId).select("fcmToken");
                if (targetUser?.fcmToken) {
                    await admin.messaging().send({
                        notification: { title, body },
                        data: { rideId: rideId.toString(), status: "CANCELLED" },
                        token: targetUser.fcmToken
                    });
                }
            } catch (err) {
                console.error("❌ فشل إرسال إشعار FCM:", err);
            }

            // 💾 تخزين الإشعار في قاعدة البيانات
            try {
                await NotificationModell.create({
                    userId: targetId,
                    title,
                    body,
                    type: "RIDE_CANCELLED",
                    data: { rideId, cancelledBy: user._id, reason: cancellationReason },
                });
            } catch (err) {
                console.error("⚠️ فشل تخزين الإشعار:", err);
            }

        } catch (err) {
            console.error("❌ Error in cancelRide:", err);
            socket.emit("socketErrorResponse", { message: "❌ خطأ أثناء إلغاء الرحلة" });
        }

    });
};
