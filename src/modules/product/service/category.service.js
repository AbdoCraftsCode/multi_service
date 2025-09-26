// import { CategoryModel } from "../../../DB/models/Category.model.js";

// import cloud from "../../../utlis/multer/cloudinary.js";
// import { asyncHandelr } from "../../../utlis/response/error.response.js";
// import { successresponse } from "../../../utlis/response/success.response.js";

// import * as dbservice from "../../../DB/dbservice.js"
// import { DepartmentModel } from "../../../DB/models/Department3.model.js";
// import Usermodel from "../../../DB/models/User.model.js";
// import { SocialMediaModel } from "../../../DB/models/socialmidia.model.js";
// import { ProductModel } from "../../../DB/models/product.model.js";
// // import admin from 'firebase-admin';
// import { MostawdaaModel } from "../../../DB/models/mostoda3.model.js";
// import { mixModel } from "../../../DB/models/mix.model.js";
// import { NotificationModel } from "../../../DB/models/notification.model.js";
// export const createCategory = asyncHandelr(async (req, res, next) => {
//     console.log("User Data:", req.user); 
//     if (!["Admin", "Owner"].includes(req.user.role)) {
//         return next(new Error("Unauthorized! Only Admins or Owners can create categories.", { cause: 403 }));
//     }


//     const { secure_url, public_id } = await cloud.uploader.upload(req.file.path, { folder: `categories/${req.user._id}` });

//     const category = await CategoryModel.create({
//         name: {
//             en: req.body.name_en,
//             ar: req.body.name_ar
//         },
//         image: { secure_url, public_id },
//         updatedBy: req.user._id
//     });

//     return successresponse(res, "Category created successfully!", 201, );
// });



// export const createMostawdaa = asyncHandelr(async (req, res, next) => {
//     console.log("User Data:", req.user);

//     // التحقق من الصلاحيات
//     if (!["Admin", "Owner"].includes(req.user.role)) {
//         return next(new Error("Unauthorized! Only Admins or Owners can create Mostawdaa.", { cause: 403 }));
//     }

//     // رفع الصورة على Cloudinary
//     const { secure_url, public_id } = await cloud.uploader.upload(req.file.path, {
//         folder: `mostawdaat/${req.user._id}`
//     });

//     // إنشاء المستودع في قاعدة البيانات
//     const mostawdaa = await MostawdaaModel.create({
//         name: {
//             en: req.body.name_en,
//             ar: req.body.name_ar
//         },
//         image: { secure_url, public_id },
//         location1: {
//             en: req.body.location1_en,
//             ar: req.body.location1_ar
//         },
//         location2: {
//             en: req.body.location2_en,
//             ar: req.body.location2_ar
//         },
//         owner: {
//             en: req.body.owner_en,
//             ar: req.body.owner_ar
//         },
//         workdate: {
//             en: req.body.workdate_en,
//             ar: req.body.workdate_ar
//         },
//         phone: req.body.phone,
//         watsapp: req.body.watsapp,
//         updatedBy: req.user._id
//     });

//     return successresponse(res, "Mostawdaa created successfully!", 201,);
// });

// export const updateMostawdaa = asyncHandelr(async (req, res, next) => {
//     // تحقق من صلاحية المستخدم (إذا كان Admin أو Owner)
//     if (!["Admin", "Owner"].includes(req.user.role)) {
//         return next(new Error("Unauthorized! Only Admins or Owners can update mostawdaas.", { cause: 403 }));
//     }

//     // البحث عن المستودع باستخدام المعرف (categoryId)
//     const mostawdaa = await MostawdaaModel.findById(req.params.mostawdaaId);
//     if (!mostawdaa) {
//         return next(new Error("Mostawdaa not found!", { cause: 404 }));
//     }

//     // إذا تم تحميل صورة جديدة
//     let newImage = mostawdaa.image;
//     if (req.file) {
//         const { secure_url, public_id } = await cloud.uploader.upload(req.file.path, { folder: `mostawdaas/${req.user._id}` });
//         newImage = { secure_url, public_id };

//         // إذا كانت هناك صورة قديمة، احذفها من Cloudinary
//         if (mostawdaa.image.public_id) {
//             await cloud.uploader.destroy(mostawdaa.image.public_id);
//         }
//     }

//     // تحديث بيانات المستودع
//     mostawdaa.name.en = req.body.name_en || mostawdaa.name.en;
//     mostawdaa.name.ar = req.body.name_ar || mostawdaa.name.ar;
//     mostawdaa.location1.en = req.body.location1_en || mostawdaa.location1.en;
//     mostawdaa.location1.ar = req.body.location1_ar || mostawdaa.location1.ar;
//     mostawdaa.location2.en = req.body.location2_en || mostawdaa.location2.en;
//     mostawdaa.location2.ar = req.body.location2_ar || mostawdaa.location2.ar;
//     mostawdaa.owner.en = req.body.owner_en || mostawdaa.owner.en;
//     mostawdaa.owner.ar = req.body.owner_ar || mostawdaa.owner.ar;
//     mostawdaa.workdate.en = req.body.workdate_en || mostawdaa.workdate.en;
//     mostawdaa.workdate.ar = req.body.workdate_ar || mostawdaa.workdate.ar;
//     mostawdaa.phone = req.body.phone || mostawdaa.phone;
//     mostawdaa.watsapp = req.body.watsapp || mostawdaa.watsapp;
//     mostawdaa.image = newImage;  // تحديث الصورة
//     mostawdaa.updatedBy = req.user._id;  // تحديث المستخدم الذي قام بالتعديل

//     // حفظ التغييرات
//     await mostawdaa.save();

//     return successresponse(res, "Mostawdaa updated successfully!", 200,);
// });


// export const deleteMostawdaa = asyncHandelr(async (req, res, next) => {
    
//     if (!["Admin", "Owner"].includes(req.user.role)) {
//         return next(new Error("Unauthorized! Only Admins or Owners can delete mostawdaas.", { cause: 403 }));
//     }


//     const mostawdaa = await MostawdaaModel.findById(req.params.mostawdaaId);
//     if (!mostawdaa) {
//         return next(new Error("Mostawdaa not found!", { cause: 404 }));
//     }

 
//     if (mostawdaa.image.public_id) {
//         await cloud.uploader.destroy(mostawdaa.image.public_id);
//     }

  
//     await MostawdaaModel.findByIdAndDelete(req.params.mostawdaaId);

//     return successresponse(res, "Mostawdaa deleted successfully!", 200);
// });



// ;

// export const getAllProductsWithWarehouses = async (req, res) => {
//     try {
//         const result = await mixModel.aggregate([
//             {
//                 $lookup: {
//                     from: "products",
//                     localField: "Product",
//                     foreignField: "_id",
//                     as: "productInfo"
//                 }
//             },
//             {
//                 $unwind: "$productInfo"
//             },
//             {
//                 $lookup: {
//                     from: "mostawdaas",
//                     localField: "Mostawdaa",
//                     foreignField: "_id",
//                     as: "warehouseInfo"
//                 }
//             },
//             {
//                 $unwind: "$warehouseInfo"
//             },
//             {
//                 $group: {
//                     _id: "$Product",
//                     productData: { $first: "$productInfo" },
//                     warehouses: { $push: "$warehouseInfo.name" } // assuming name is { en, ar }
//                 }
//             },
//             {
//                 $project: {
//                     _id: 1,
//                     productData: 1,
//                     warehouses: 1
//                 }
//             }
//         ]);

//         res.json({ success: true, data: result });
//     } catch (error) {
//         console.error("Error:", error);
//         res.status(500).json({ success: false, message: "Something went wrong" });
//     }
// };




// export const deleteMix = asyncHandelr(async (req, res, next) => {
//     const { mixId } = req.params;

//     const deletedMix = await mixModel.findByIdAndDelete(mixId);
//     if (!deletedMix) {
//         return res.status(404).json({ message: "❌ العنصر غير موجود" });
//     }

//     return res.status(200).json({
//         message: "🗑️ تم حذف العنصر من جدول Mix بنجاح"
//     });
// });


// // export const sendNotificationToUser = asyncHandelr(async (req, res, next) => {
// //     console.log("User Data:", req.user);
// //     if (!["Admin", "Owner"].includes(req.user.role)) {
// //         return next(new Error("Unauthorized! Only Admins or Owners can send notifications.", { cause: 403 }));
// //     }

// //     if (!req.body.email) {
// //         return next(new Error("❌ يجب توفير البريد الإلكتروني!", { cause: 400 }));
// //     }

// //     let secure_url = null;
// //     let public_id = null;

// //     // تأكد أن الصورة تم رفعها
// //     if (req.file) {
// //         const uploadResult = await cloud.uploader.upload(req.file.path, { folder: `orderdetails/${req.user._id}` });
// //         secure_url = uploadResult.secure_url;
// //         public_id = uploadResult.public_id;
// //     } else {
// //         return next(new Error("❌ يجب رفع صورة!", { cause: 400 }));
// //     }

// //     const user = await Usermodel.findOne({ email: req.body.email });

// //     if (!user) {
// //         return next(new Error("❌ المستخدم غير موجود!", { cause: 404 }));
// //     }

// //     // التأكد من وجود المدخلات المطلوبة
// //     if (!req.body.orderStatus_en || !req.body.orderStatus_ar) {
// //         return next(new Error("❌ يجب توفير حالة الطلب باللغة العربية والإنجليزية!", { cause: 400 }));
// //     }

// //     // إضافة البيانات إلى الـ Array مباشرةً بدون مشاكل
// //     const newNotification = {
// //         orderDate: req.body.orderDate,
// //         orderDetails: {
// //             en: req.body.orderDetails_en,
// //             ar: req.body.orderDetails_ar
// //         },
// //         orderStatus: {
// //             en: req.body.orderStatus_en,
// //             ar: req.body.orderStatus_ar
// //         },
// //         orderPaid: req.body.orderPaid,
       
// //         remainingAmount: req.body.remainingAmount,
// //         orderNumber: req.body.orderNumber,
// //         ordervalue: req.body.ordervalue,
// //         image: { secure_url, public_id },
// //         updatedBy: req.user._id
// //     };

// //     // دفع البيانات الجديدة داخل المصفوفة مباشرةً
// //     user.notifications.push(newNotification);

// //     // حفظ التحديثات
// //     await user.save();

// //     return successresponse(res, "✅ تم إرسال الإشعار بنجاح!", 201);
// // });



// export const sendNotificationToUser = asyncHandelr(async (req, res, next) => {
//     console.log("User Data:", req.user);
//     if (!["Admin", "Owner"].includes(req.user.role)) {
//         return next(new Error("Unauthorized! Only Admins or Owners can send notifications.", { cause: 403 }));
//     }
 
//     if (!req.body.username) {
//         return next(new Error("❌ يجب توفير اسم المستخدم !", { cause: 400 }));
//     }

//     let secure_url = null;
//     let public_id = null;

//     // ✅ جعل رفع الصورة اختياري
//     if (req.file) {
//         const uploadResult = await cloud.uploader.upload(req.file.path, { folder: `orderdetails/${req.user._id}` });
//         secure_url = uploadResult.secure_url;
//         public_id = uploadResult.public_id;
//     }

//     const user = await Usermodel.findOne({ username: req.body.username });

//     if (!user) {
//         return next(new Error("❌ المستخدم غير موجود!", { cause: 404 }));
//     }

//     // التأكد من وجود المدخلات المطلوبة
//     if (!req.body.orderStatus_en || !req.body.orderStatus_ar) {
//         return next(new Error("❌ يجب توفير حالة الطلب باللغة العربية والإنجليزية!", { cause: 400 }));
//     }

//     const newNotification = {
//         orderDate: req.body.orderDate,
//         orderDetails: {
//             en: req.body.orderDetails_en,
//             ar: req.body.orderDetails_ar
//         },
//         orderStatus: {
//             en: req.body.orderStatus_en,
//             ar: req.body.orderStatus_ar
//         },
//         orderPaid: req.body.orderPaid
//             ? [{ amount: req.body.orderPaid, date: new Date() }]
//             : [],
//         remainingAmount: req.body.remainingAmount
//             ? [{ amount: req.body.remainingAmount, date: new Date() }]
//             : [],
//         orderNumber: req.body.orderNumber,
//         ordervalue: req.body.ordervalue,
//         image: { secure_url, public_id },
//         updatedBy: req.user._id
//     };


//     user.notifications.push(newNotification);
//     await user.save();

//     // ✅ تخزين الإشعار في قاعدة بيانات NotificationModel
//     await NotificationModel.create({
//         user: user._id,
//         title: "📩 إشعار جديد بخصوص الطلب",
//         body: `تم تحديث حالة الطلب إلى: ${req.body.orderStatus_ar || "غير محدد"}`,
//     });

//     // ✅ إرسال إشعار للموبايل إذا كان fcmToken موجود
//     if (user.fcmToken) {
//         const message = {
//             notification: {
//                 title: "📩 إشعار جديد",
//                 body: `تم تحديث حالة الطلب إلى: ${req.body.orderStatus_ar || "غير محدد"}`,
//             },
//             token: user.fcmToken,
//         };

//         try {
//             await admin.messaging().send(message);
//             console.log("✅ تم إرسال إشعار FCM للمستخدم");
//         } catch (error) {
//             console.error("❌ فشل إرسال إشعار FCM:", error.message);
//         }
//     }

//     return successresponse(res, "✅ تم إرسال الإشعار بنجاح!", 201);
// });





// export const updateNotification = asyncHandelr(async (req, res, next) => {
//     console.log("User Data:", req.user);
//     if (!["Admin", "Owner"].includes(req.user.role)) {
//         return next(new Error("Unauthorized! Only Admins or Owners can send notifications.", { cause: 403 }));
//     }

//     if (!req.body.username) {
//         return next(new Error("❌ يجب توفير اسم المستخدم!", { cause: 400 }));
//     }

//     let secure_url = null;
//     let public_id = null;

//     const user = await Usermodel.findOne({ username: req.body.username });

//     if (!user) {
//         return next(new Error("❌ المستخدم غير موجود!", { cause: 404 }));
//     }

//     // التأكد من وجود notificationId لتحديد الإشعار المراد تعديله
//     if (!req.body.notificationId) {
//         return next(new Error("❌ يجب توفير معرف الإشعار (notificationId) لتحديد الإشعار!", { cause: 400 }));
//     }

//     // البحث عن الإشعار داخل المصفوفة باستخدام _id
//     const notificationIndex = user.notifications.findIndex(
//         (notif) => notif._id.toString() === req.body.notificationId
//     );
//     if (notificationIndex === -1) {
//         return next(new Error("❌ الإشعار غير موجود!", { cause: 404 }));
//     }

   
//     if (req.file) {
  
//         const oldImagePublicId = user.notifications[notificationIndex].image?.public_id;
//         if (oldImagePublicId) {
//             await cloud.uploader.destroy(oldImagePublicId);
//         }

     
//         const uploadResult = await cloud.uploader.upload(req.file.path, { folder: `orderdetails/${req.user._id}` });
//         secure_url = uploadResult.secure_url;
//         public_id = uploadResult.public_id;
//     }

//     // التأكد من وجود المدخلات المطلوبة لحالة الطلب إذا تم إرسالها
//     if ((req.body.orderStatus_en && !req.body.orderStatus_ar) || (!req.body.orderStatus_en && req.body.orderStatus_ar)) {
//         return next(new Error("❌ يجب توفير حالة الطلب باللغة العربية والإنجليزية معًا!", { cause: 400 }));
//     }

//     // تحديث البيانات مع الاحتفاظ بالقيم القديمة إذا لم تُرسل قيم جديدة
//     const updatedNotification = {
//         orderDate: req.body.orderDate || user.notifications[notificationIndex].orderDate,
//         orderDetails: {
//             en: req.body.orderDetails_en || user.notifications[notificationIndex].orderDetails.en,
//             ar: req.body.orderDetails_ar || user.notifications[notificationIndex].orderDetails.ar
//         },
//         orderStatus: {
//             en: req.body.orderStatus_en || user.notifications[notificationIndex].orderStatus.en,
//             ar: req.body.orderStatus_ar || user.notifications[notificationIndex].orderStatus.ar
//         },

//         orderPaid: req.body.orderPaid
//             ? [...(user.notifications[notificationIndex].orderPaid || []), { amount: req.body.orderPaid, date: new Date() }]
//             : user.notifications[notificationIndex].orderPaid,
//         remainingAmount: req.body.remainingAmount
//             ? [...(user.notifications[notificationIndex].remainingAmount || []), { amount: req.body.remainingAmount, date: new Date() }]
//             : user.notifications[notificationIndex].remainingAmount,
//         // orderPaid: req.body.orderPaid || user.notifications[notificationIndex].orderPaid,
//         ordervalue: req.body.ordervalue || user.notifications[notificationIndex].ordervalue,
//         // remainingAmount: req.body.remainingAmount || user.notifications[notificationIndex].remainingAmount,
//         orderNumber: req.body.orderNumber || user.notifications[notificationIndex].orderNumber,
//         image: secure_url ? { secure_url, public_id } : user.notifications[notificationIndex].image,
//         updatedBy: req.user._id
//     };

//     // استبدال الإشعار القديم بالجديد
//     user.notifications[notificationIndex] = {
//         ...updatedNotification,
//         _id: user.notifications[notificationIndex]._id
//     };


//     // حفظ التحديثات
//     await user.save();

//     return successresponse(res, "✅ تم تعديل الإشعار بنجاح!", 200);
// });





// export const getNotificationsByEmail = asyncHandelr(async (req, res, next) => {
 

//     if (!req.body.username) {
//         return next(new Error("❌ يجب توفير اسم المستخدم!", { cause: 400 }));
//     }

//     const user = await Usermodel.findOne({ username: req.body.username }).select("notifications");

//     if (!user) {
//         return next(new Error("❌ المستخدم غير موجود!", { cause: 404 }));
//     }

//     // التحقق من وجود إشعارات
//     if (!user.notifications || user.notifications.length === 0) {
//         return next(new Error("❌ لا توجد إشعارات لهذا المستخدم!", { cause: 404 }));
//     }

//     return successresponse(res, "✅ تم جلب الإشعارات بنجاح!", 200, { notifications: user.notifications });
// });







// export const updateCategory = asyncHandelr(async (req, res, next) => {
//     if (!["Admin", "Owner"].includes(req.user.role)) {
//         return next(new Error("Unauthorized! Only Admins or Owners can update categories.", { cause: 403 }));
//     }

//     const category = await CategoryModel.findById(req.params.categoryId);
//     if (!category) {
//         return next(new Error("Category not found!", { cause: 404 }));
//     }

//     let newImage = category.image;
//     if (req.file) {
//         const { secure_url, public_id } = await cloud.uploader.upload(req.file.path, { folder: `categories/${req.user._id}` });
//         newImage = { secure_url, public_id };

        
//         if (category.image.public_id) {
//             await cloud.uploader.destroy(category.image.public_id);
//         }
//     }

    
//     category.name.en = req.body.name_en || category.name.en;
//     category.name.ar = req.body.name_ar || category.name.ar;
//     category.image = newImage;
//     category.updatedBy = req.user._id;
//     await category.save();

//     return successresponse(res, "Category updated successfully!", 200, );
// });





// export const getCategories = asyncHandelr(async (req, res, next) => {
//     const categories = await dbservice.findAll({
//         model: CategoryModel,
//         select: 'name image secure_url public_id updatedBy createdAt updatedAt'
//     });

//     if (!categories.length) {
//         return next(new Error("No categories found", { cause: 404 }));
//     }

//     return successresponse(res, "Categories retrieved successfully!", 200, { categories });
// });

// // export const deleteCategory = asyncHandelr(async (req, res, next) => {
 
// //     if (!["Admin", "Owner"].includes(req.user.role)) {
// //         return next(new Error("Unauthorized! Only Admins or Owners can delete categories.", { cause: 403 }));
// //     }

   
// //     const category = await CategoryModel.findById(req.params.categoryId);
// //     if (!category) {
// //         return next(new Error("Category not found!", { cause: 404 }));
// //     }

  
// //     if (category.image?.public_id) {
// //         await cloud.uploader.destroy(category.image.public_id);
// //     }

   
// //     await category.deleteOne();

// //     return successresponse(res, "Category deleted successfully!", 200);
// // });
// export const deleteCategory = asyncHandelr(async (req, res, next) => {
//     if (!["Admin", "Owner"].includes(req.user.role)) {
//         return next(
//             new Error("Unauthorized! Only Admins or Owners can delete categories.", {
//                 cause: 403,
//             })
//         );
//     }

//     const category = await CategoryModel.findById(req.params.categoryId);
//     if (!category) {
//         return next(new Error("Category not found!", { cause: 404 }));
//     }

//     // حذف صورة الكاتيجوري من cloudinary
//     if (category.image?.public_id) {
//         await cloud.uploader.destroy(category.image.public_id);
//     }

//     // حذف المنتجات المرتبطة بهذه الكاتيجوري
//     await ProductModel.deleteMany({ category: category._id });


//     // حذف الكاتيجوري نفسه
//     await category.deleteOne();

//     return successresponse(res, "Category deleted successfully!", 200);
// });


// export const createdepatment = asyncHandelr(async (req, res, next) => {
//     console.log("User Data:", req.user);
//     if (!["Admin", "Owner"].includes(req.user.role)) {
//         return next(new Error("Unauthorized! Only Admins or Owners can create categories.", { cause: 403 }));
//     }


   

//     const category = await DepartmentModel.create({
//         name: {
//             en: req.body.name_en,
//             ar: req.body.name_ar
//         },
        
//         updatedBy: req.user._id
//     });

//     return successresponse(res, "department created successfully!", 201,);
// });


// export const getdepartment = asyncHandelr(async (req, res, next) => {
//     const department = await dbservice.findAll({
//         model: DepartmentModel,
//         select: 'name image secure_url public_id updatedBy createdAt updatedAt'
//     });

//     if (!department.length) {
//         return next(new Error("No categories found", { cause: 404 }));
//     }

//     return successresponse(res, "department retrieved successfully!", 200, { department });
// });


// export const deletedepartment = asyncHandelr(async (req, res, next) => {

//     if (!["Admin", "Owner"].includes(req.user.role)) {
//         return next(new Error("Unauthorized! Only Admins or Owners can delete categories.", { cause: 403 }));
//     }


//     const category = await DepartmentModel.findById(req.params.departmentId);
//     if (!category) {
//         return next(new Error("department not found!", { cause: 404 }));
//     }


   

//     await category.deleteOne();

//     return successresponse(res, "department deleted successfully!", 200);
// });

// export const updatedepartment = asyncHandelr(async (req, res, next) => {
//     if (!["Admin", "Owner"].includes(req.user.role)) {
//         return next(new Error("Unauthorized! Only Admins or Owners can update categories.", { cause: 403 }));
//     }

//     const category = await DepartmentModel.findById(req.params.departmentId);
//     if (!category) {
//         return next(new Error("department not found!", { cause: 404 }));
//     }

   


//     category.name.en = req.body.name_en || category.name.en;
//     category.name.ar = req.body.name_ar || category.name.ar;
 
//     category.updatedBy = req.user._id;
//     await category.save();

//     return successresponse(res, "department updated successfully!", 200,);
// });















// export const createSocialMedia = asyncHandelr(async (req, res, next) => {
//     const { phone, whatsapp, facebook, twitter, instagram, tiktok, snapchat, youtupe } = req.body;

//     console.log("📩 Received Request Body:", req.body);

//     // التحقق من وجود بيانات تواصل اجتماعي سابقة
//     const existingSocialMedia = await SocialMediaModel.findOne();
//     if (existingSocialMedia) {
//         return next(new Error("❌ بيانات التواصل الاجتماعي موجودة بالفعل! يمكنك تعديلها.", { cause: 400 }));
//     }

   
//     const socialMedia = new SocialMediaModel({
//         phone,
//         whatsapp,
//         facebook,
//         twitter,
//         instagram,
//         tiktok,
//         snapchat,
//         youtupe
//     });

//     await socialMedia.save();

//     return successresponse(res, "✅ تم إنشاء بيانات التواصل الاجتماعي بنجاح!", 201);
// });






// export const getSocialMedia = asyncHandelr(async (req, res, next) => {
//     // البحث عن بيانات التواصل الاجتماعي
//     const socialMedia = await SocialMediaModel.findOne();
//     if (!socialMedia) {
//         return next(new Error("❌ لا توجد بيانات تواصل اجتماعي!", { cause: 404 }));
//     }

//     return successresponse(res, "✅ تم جلب بيانات التواصل الاجتماعي بنجاح!", 200, { socialMedia });
// });




// export const updateSocialMedia = asyncHandelr(async (req, res, next) => {
//     const { phone, whatsapp, facebook, twitter, instagram, tiktok, snapchat } = req.body;

//     console.log("📩 Received Request Body:", req.body);

//     // البحث عن بيانات التواصل الاجتماعي
//     const socialMedia = await SocialMediaModel.findOne();
//     if (!socialMedia) {
//         return next(new Error("❌ لا توجد بيانات تواصل اجتماعي لتعديلها! قم بإنشائها أولاً.", { cause: 404 }));
//     }

//     // تحديث بيانات التواصل الاجتماعي (فقط الحقول المُرسلة)
//     socialMedia.phone = phone || socialMedia.phone;
//     socialMedia.whatsapp = whatsapp || socialMedia.whatsapp;
//     socialMedia.facebook = facebook || socialMedia.facebook;
//     socialMedia.twitter = twitter || socialMedia.twitter;
//     socialMedia.instagram = instagram || socialMedia.instagram;
//     socialMedia.tiktok = tiktok || socialMedia.tiktok;
//     socialMedia.snapchat = snapchat || socialMedia.snapchat;

//     await socialMedia.save();

//     return successresponse(res, "✅ تم تحديث بيانات التواصل الاجتماعي بنجاح!", 200);
// });






// const serviceAccount = {
//     type: "service_account",
//     project_id: "merba3-f8802",
//     private_key_id: "3e7a5bb045c3be0f157873eaf27ac985b14c2565",
//     private_key: `-----BEGIN PRIVATE KEY-----
// MIIEugIBADANBgkqhkiG9w0BAQEFAASCBKQwggSgAgEAAoIBAQCeNOD1B8bHVCy5
// sGPBgTnQCeGItj2/xY5RxvEzdpcKX3c9LpqwuVOwuPPt07jgjTypMX7ybC/VJVzw
// imChZLPYo3lodhaZDVHGAjKeRcukomMn4VrGucyIyKlz4XB5KMBXzY4XjEJfq557
// hI23LExgW+rK6WMLGvKtOOdiFUALKRSXofchOuCEGWW/n+aZ6+85m2TdY9wMFeEU
// efFIS13LvgI5yFg38jXTviECrc6Ni/P2aP5E9TfBU7JHmu59Da3P0JtGnwm2mhap
// Uvhoz5CoUVrKsZe0vimjZwm9ue8godh6y18MYjChwDZzpcjgM8roZnjiEAw2BAGR
// H+SqSUzFAgMBAAECgf8cDa42q3TfL5O+uyLNY2CzMXwtVGyoGPrVNRhJ29WkEHnQ
// gIP/8Nz6fGO9A/4MRIVIQ9eJckOetU4h80Do6kpODxt21B3O9ewmuQqea5LY+4uH
// WR+q40/Fi5OpvBCkwu4U4cu7I7gohSxddFrzwA2vWW/LeRlYo8O4N92MLOOyhpWQ
// BFeh3fxR1mK8ktZFF0f7yCaMmOPFZeOWF4YueBjTVfQwtxEskFHHR+uhNCdgTlBo
// r2o30leAHJjrojDhbueraDcf+jrU0Bu9icE4PWBEuVfpQ/apTse51uI/2vhGgFOL
// +0Mg4ILASrS+ndSK0TdH4ajEiLiU+XTjcpvWWkECgYEAz78L+JxwN2IZH5T0uSe4
// E4UYK7wDdjzcKPdCo4JOjAlrsdvDbhq2iDGaetLQJUcU6sYeGhvfWe0gkT7zTrvv
// KEsJrPwBZztc9AsrFo00pSBMchSpLZnlC5s0MuIPYSC/yqmW30VeMprKKg4IQyu/
// vcEa+Mo8r2u08DMuvakPIAUCgYEAwvQdUgq9/Aqdz+ho5XfuVc0rEAHrsCzmDnpZ
// Y9ncalHlFurIhi6rs/SHOyCoiGXo/YdBWCq6z4HMvTYN9qhj/tnfU+BSMCElZGQI
// Xj2OavaWtPl4R3Xi1wIP2N2Wxs2wMMMABsDEoxrdyqSTc3bPGItuNkA/56GtCq6T
// D/mm1cECgYBDeLQFoaFci3LHbBRzUjAZvt9TzPN+4lNKxsuQ2VBzcNfWYx680tY3
// s4yNmYxanxRvD7tVFXpb9YTfR4e0KZuKBZz13r8B7SjKZhovb9sKSkwpvQYZNmNK
// erTgVcVS8VT5GE1U5G2sl9NTB02tqzbSBTaiWOSOwLd6T9U9afvslQKBgGm8bv6l
// Vt+RfoBaBDKY9opQyc9Xy1X1NB2cHEl8ywBbRI5GbtXgED59HK9kCiRYaaLALh+8
// pS+QrdPdsnsaX4nE70yVuN3jzF0DqEo8xraa4ahsOeFAPfTxaFjt7i4LN0lrKeN/
// v+ba1npnApY4VSBx1yfTdxWRacIGZzrd46/BAoGATZke5s3oS8OX3hvr5zULP84J
// iHTqGpWHYQzkRFxN7b934nTO6GsF+Rx4xf5tlZldnjo2HB5KpkIEoT/6AcpiSTYQ
// PMXdIUigLU5Miv9iwRSOQSUibSPnlSyCS5wKXQV/wVPoU+B1yrEr71Ii3BxEFQ3b
// Ucztf8+48J9J+qMzTbQ=
// -----END PRIVATE KEY-----`,
//     client_email: "firebase-adminsdk-fbsvc@merba3-f8802.iam.gserviceaccount.com",
//     client_id: "116339282509322684729",
//     auth_uri: "https://accounts.google.com/o/oauth2/auth",
//     token_uri: "https://oauth2.googleapis.com/token",
//     auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
//     client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40merba3-f8802.iam.gserviceaccount.com",
//     universe_domain: "googleapis.com",
// };

// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
// })
// // دالة إرسال إشعار
// async function sendNotification(deviceToken, title, body) {
//     const message = {
//         notification: { title, body },
//         token: deviceToken,
//     };

//     try {
//         const response = await admin.messaging().send(message);
//         console.log('✅ تم إرسال الإشعار:', response);
//     } catch (error) {
//         console.error('❌ فشل إرسال الإشعار:', error);
//     }
// }

// // مثال استخدام
// // sendNotification(
// //     'e7WLm-VzRK-5GYOkcFHn6h:APA91bGuirefJfC5cfRTAhJIlft6KLq9q9qCcixADyuwW0ls2qEsfmkWguLuK8sEiO37XZ2y8TujlL2UcaC2_lOXtMje2rnengioJBYz4fdq2NmwoJUSW5I',
// //     '💡 إشعار تجريبي',
// //     'هذا مجرد اختبار من الباك اند'
// // );



// // مثلا: POST /api/save-token



// export const savetoken = asyncHandelr(async (req, res, next) => {
//     const { userId, fcmToken } = req.body;

//     if (!userId || !fcmToken) {
//         return res.status(400).json({ message: "userId و fcmToken مطلوبين" });
//     }

//     try {
//         await Usermodel.findByIdAndUpdate(userId, { fcmToken });
//         res.json({ message: "تم حفظ التوكن بنجاح" });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "حدث خطأ أثناء حفظ التوكن" });
//     }
    
// });



// export const sendnotification = asyncHandelr(async (req, res, next) => {
//     const { userId, title, body } = req.body;

//     if (!userId || !title || !body) {
//         return res.status(400).json({ message: "userId و title و body مطلوبين" });
//     }

//     try {
//         const user = await Usermodel.findById(userId);
//         if (!user || !user.fcmToken) {
//             return res.status(404).json({ message: "المستخدم غير موجود أو لا يحتوي على FCM Token" });
//         }

//         const message = {
//             notification: { title, body },
//             token: user.fcmToken,
//         };

//         await NotificationModel.create({ user: user._id, title, body });

//         const response = await admin.messaging().send(message);
//         console.log('✅ تم إرسال الإشعار:', response);

//         res.json({ message: "تم إرسال الإشعار بنجاح", response });
//     } catch (error) {
//         console.error('❌ فشل إرسال الإشعار:', error);
//         res.status(500).json({ message: "فشل إرسال الإشعار", error: error.message });
//     }

// });


// export const notifyall = asyncHandelr(async (req, res, next) => {
//     const { title, body } = req.body;

//     if (!title || !body) {
//         return res.status(400).json({ message: "العنوان والمحتوى مطلوبين" });
//     }

//     try {
//         const users = await Usermodel.find({ fcmToken: { $ne: null } });

//         let successCount = 0;
//         let failCount = 0;

//         for (let user of users) {
//             try {
//                 // 1. إرسال الإشعار
//                 await sendNotification(user.fcmToken, title, body);

//                 // 2. تخزين الإشعار في قاعدة البيانات
//                 await NotificationModel.create({
//                     user: user._id,
//                     title,
//                     body,
//                     isRead: false
//                 });

//                 successCount++;
//             } catch (e) {
//                 console.error(`❌ فشل إرسال/تخزين إشعار للمستخدم ${user._id}:`, e.message);
//                 failCount++;
//             }
//         }

//         return res.status(200).json({
//             message: "✅ تم تنفيذ إرسال وتخزين الإشعارات",
//             totalUsers: users.length,
//             successCount,
//             failCount
//         });
//     } catch (err) {
//         console.error(err);
//         return res.status(500).json({ message: "❌ حدث خطأ أثناء إرسال الإشعارات" });
//     }
// });



// export const getUserNotifications = asyncHandelr(async (req, res) => {
//     const userId = req.user._id; // تأكد إنك ممرر `auth middleware`

//     const notifications = await NotificationModel.find({ user: userId })
//         .sort({ createdAt: -1 }); // الأحدث أولًا

//     res.status(200).json({
//         message: "📬 تم جلب الإشعارات",
//         notifications
//     });
// });



// export const markNotificationAsRead = asyncHandelr(async (req, res) => {
//     const { id } = req.params;

//     const notification = await NotificationModel.findById(id);
//     if (!notification) {
//         return res.status(404).json({ message: "❌ الإشعار غير موجود" });
//     }

//     notification.isRead = true;
//     await notification.save();

//     res.status(200).json({ message: "✅ تم تعليم الإشعار كمقروء" });
// });



// export const markAllAsRead = asyncHandelr(async (req, res) => {
//     const userId = req.user._id;

//     await NotificationModel.updateMany(
//         { user: userId, isRead: false },
//         { $set: { isRead: true } }
//     );

//     res.status(200).json({ message: "✅ تم تعليم كل الإشعارات كمقروءة" });
// });

// export const deleteFcmToken = asyncHandelr(async (req, res) => {
//     const userId = req.user._id;

//     try {
//         const user = await Usermodel.findById(userId);
//         if (!user) {
//             return res.status(404).json({ message: "❌ المستخدم غير موجود!" });
//         }

//         user.fcmToken = null; // 🧹 حذف التوكن
//         await user.save();

//         res.status(200).json({ message: "✅ تم حذف FCM Token بنجاح" });
//     } catch (error) {
//         console.error("❌ خطأ أثناء حذف التوكن:", error);
//         res.status(500).json({ message: "حدث خطأ أثناء حذف التوكن", error: error.message });
//     }
// });



// // send-notification route




// import nodemailer from "nodemailer";

// const transporter = nodemailer.createTransport({
//     host: "smtp.mailersend.net",
//     port: 2525, // أو 2525 لو 587 مش شغال
//     secure: false, // استخدم true فقط مع port 465
//     auth: {
//         user: "MS_reB7kP@test-z0vklo6q3dpl7qrx.mlsender.net",
//         pass: "mssp.a9NtANX.pr9084z6qpxlw63d.RhWxCks",
//     },
// });

// const sendEmail = async () => {
//     try {
//         const info = await transporter.sendMail({
//             from: '"WEVA" <weva@test-z0vklo6q3dpl7qrx.mlsender.net>', // لازم يكون نفس الدومين
//             to: "yallabinaok@gmail.com", // الإيميل اللي هتجرب عليه
//             subject: "📧 اختبار إرسال من MailerSend",
//             html: "<h2>تم إرسال هذا الإيميل بنجاح عبر MailerSend SMTP 🚀</h2>",
//         });

//         console.log("✅ الإيميل تم إرساله:", info.messageId);
//     } catch (error) {
//         console.error("❌ فشل الإرسال:", error.message);
//     }
// };

// sendEmail();




