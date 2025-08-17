import { asyncHandelr } from "../../../utlis/response/error.response.js";
import * as dbservice from "../../../DB/dbservice.js"
import Usermodel from "../../../DB/models/User.model.js";
import { successresponse } from "../../../utlis/response/success.response.js";
import { comparehash, decryptData, encryptData, generatehash } from "../../../utlis/security/hash.security.js";
import cloud from "../../../utlis/multer/cloudinary.js";
import { MessageModel } from "../../../DB/models/message.model.js";
import { ProductModel } from "../../../DB/models/product.model.js";
import { FavoriteModel } from "../../../DB/models/favourite.model.js";


import fs from 'fs';
import admin from 'firebase-admin';

export const Updateuseraccount = asyncHandelr(async (req, res, next) => {
    const user = await dbservice.findOne({
        model: Usermodel,
        filter: { username: req.body.username } // تأكد من أن الإيميل موجود
    });

    if (!user) {
        return next(new Error("❌ user not found in system", { cause: 404 }));
    }

    // تحديث بيانات المستخدم
    const updatedUser = await dbservice.findOneAndUpdate({
        model: Usermodel,
        filter: { username: req.body.username },
        data: req.body, // تمرير البيانات مباشرة
        options: { new: true }
    });

    return successresponse(res, "✅ User updated successfully!", 200, );
});



    
  

export const updatepassword = asyncHandelr(async (req, res, next) => {
    const { oldpassword, password, confirmationpassword } = req.body
    if (!comparehash({ planText: oldpassword, valuehash: req.user.password })) {
        
        return next(new Error("password not correct", { cause: 404 }))
    }
  
    
    const user = await dbservice.findOneAndUpdate({

        model: Usermodel,
        filter: {

            _id: req.user._id
        },
        data: {
            password: generatehash({ planText: password }) 
            , changecredintialTime: Date.now()
        }
    })



 


    return successresponse(res,"done success", 201, {
     username:user.username
    })
})

 

export const Getloginuseraccount = asyncHandelr(async (req, res, next) => {
// جلب اللغة من الـ query (مثلاً ?lang=ar أو ?lang=en)

    const user = await dbservice.findOne({
        model: Usermodel,
        filter: { _id: req.user._id }
    });

    if (!user) {
        return next(new Error("❌ المستخدم غير موجود في النظام!", { cause: 404 }));
    }

    // ✅ اختيار الإشعارات باللغة المطلوبة
    // const notifications = user.notifications.map(notification => ({
       
    // }));

    return successresponse(res, "✅ تم جلب بيانات المستخدم بنجاح!", 200, {
        username: user.username,
        id: user._id, 
        Points: user.Points,
        notifications: user.notifications
      
         // ✅ إرجاع الإشعارات باللغة المطلوبة
    });
});








// export const getAllUsers = asyncHandelr(async (req, res, next) => {
//     let { page, limit } = req.query;

//     page = parseInt(page) || 1;
//     limit = parseInt(limit) || 10;
//     const skip = (page - 1) * limit;

//     // ✅ جلب المستخدمين مع تصفية الـ role
//     const users = await Usermodel.find({ role: "User" })
//         .skip(skip)
//         .limit(limit)
//         .select("firstName lastName email mobileNumber city role notifications Points")
//         .lean(); // إضافة lean() لتحويل النتيجة إلى كائن عادي

  
//     const totalUsers = await Usermodel.countDocuments({ role: "User" });

    
//     const formattedUsers = users.map(user => ({
//         firstName: user.firstName,
//         lastName: user.lastName,
//         email: user.email,
//         mobileNumber: user.mobileNumber,
//         city: user.city,
//         role: user.role,
//         Points: user.Points,
//         notifications: user.notifications,

    
//     }));

//     return successresponse(res, {
//         message: "Users retrieved successfully",
//         totalUsers,
//         currentPage: page,
//         totalPages: Math.ceil(totalUsers / limit),
//         users: formattedUsers
//     });
// });

export const getAllUsers = asyncHandelr(async (req, res, next) => {
    // ✅ جلب المستخدمين مع تصفية الـ role
    const users = await Usermodel.find({ role: "User" })
        .select(" username  mobileNumber  role notifications Points")
        .lean(); // تحويل النتيجة إلى كائن عادي

    const totalUsers = users.length;

    const formattedUsers = users.map(user => ({
     
        username: user.username,
        id: user._id,
        mobileNumber: user.mobileNumber,
 
        role: user.role,
        Points: user.Points,
        notifications: user.notifications,
    }));

    return successresponse(res, {
        message: "Users retrieved successfully",
        totalUsers,
        users: formattedUsers
    });
});


export const Getprofiledata = asyncHandelr(async (req, res, next) => {

    const user = await dbservice.findOne({

        model: Usermodel,
        filter: {

            _id: req.user._id
        }
    })
    if (!user) {

        return next(new Error("user not found in system ", { cause: 404 }))
    }

    const decryptphone = decryptData(user.mobileNumber, process.env.CRYPTO_SECRET_KEY)
    return successresponse(res, {
        username: user.username,
        // coverPic: user.coverPic,
        profilePic: user.profilePic,
    
        // mobileNumber: decryptphone,
    })
})



export const createMessage = async (req, res, next) => {
    try {
        const { firstName, lastName, phone, email, message } = req.body;

        if (!firstName || !lastName || !phone || !email || !message) {
            return res.status(400).json({ message: "❌ جميع الحقول مطلوبة!" });
        }

        const newMessage = await MessageModel.create({ firstName, lastName, phone, email, message });

        return res.status(201).json({
            message: "✅ تم إرسال الرسالة بنجاح!",
          
        });
    } catch (error) {
        next(error);
    }
};


export const getAllMessages = async (req, res, next) => {
    try {
        const messages = await MessageModel.find().sort({ createdAt: -1 });

        if (messages.length === 0) {
            return res.status(404).json({ message: "❌ لا توجد رسائل حتى الآن!" });
        }

        return res.status(200).json({
            message: "✅ تم جلب جميع الرسائل بنجاح!",
            data: messages
        });
    } catch (error) {
        next(error);
    }
};













export const updateimage = asyncHandelr(async (req, res, next) => {

    const { secure_url, public_id } = await cloud.uploader.upload(req.file.path, { folder: `user/${req.user._id}` })
    const user = await dbservice.findOneAndUpdate({

        model: Usermodel,
        filter: {
            _id: req.user._id,

        },
        data: {

            profilePic: { secure_url, public_id }
        },
        options: {
            new: false,
        }
    })

    if (user.profilePic?.secure_url) {
        await cloud.uploader.destroy(user.profilePic.public_id)

    }
    return successresponse(res, "user updated sucsess", 200, {
        file: req.file,
        user

    });
});

export const coverimages = asyncHandelr(async (req, res, next) => {

    const images = [];
    for (const file of req.files) {
        const { secure_url, public_id } = await cloud.uploader.upload(file.path, { folder: `user/${req.user._id}/cover` })
        images.push({ public_id, secure_url })
    }

    const user = await dbservice.findOneAndUpdate({

        model: Usermodel,
        filter: {
            _id: req.user._id,

        },
        data: {

            coverPic: images
        },
        options: {
            new: true,
        }
    })



    return successresponse(res, "user updated sucsess", 200, {
        file: req.files,
        user

    });
});






export const deleteProfileImage = asyncHandelr(async (req, res, next) => {
    // البحث عن المستخدم للحصول على الصورة الحالية
    const user = await dbservice.findOne({
        model: Usermodel,
        filter: { _id: req.user._id },
    });

    // التحقق مما إذا كان لدى المستخدم صورة بالفعل
    if (!user?.profilePic?.public_id) {
        return next(new Error("No profile image found to delete", { cause: 404 }));
    }

    // حذف الصورة من Cloudinary
    await cloud.uploader.destroy(user.profilePic.public_id);

    // إزالة بيانات الصورة من المستخدم
    await dbservice.findOneAndUpdate({
        model: Usermodel,
        filter: { _id: req.user._id },
        data: { profilePic: null }, // تعيين الصورة إلى null لحذفها
        options: { new: true },
    });

    return successresponse(res, "Profile image deleted successfully", 200, {
        message: "Profile image removed",
    });
});


export const deleteCoverImage = asyncHandelr(async (req, res, next) => {
    const { public_id } = req.body; 
    const userId = req.user._id; 


    await cloud.uploader.destroy(public_id);

   
    const updatedUser = await dbservice.findOneAndUpdate({
        model: Usermodel,
        filter: { _id: userId },
        data: { $pull: { coverPic: { public_id } } }, 
        options: { new: true }
    });

    return successresponse(res, "Cover image deleted successfully", 200, {
        user: updatedUser
    });
});


export const adduser = asyncHandelr(async (req, res, next) => {
    const { friendId } = req.params
    const friend = await dbservice.findOneAndUpdate({

        model: Usermodel,
        filter: {
            _id: friendId,

        },
        data: {

            $addToSet: { friends: req.user._id }
        },
        options: {
            new: true,
        }

    })

    if (!friend) {

        return next(new Error("invalied-friendId", { cause: 404 }))

    }
    const user = await dbservice.findOneAndUpdate({

        model: Usermodel,
        filter: {
            _id: req.user._id,
            isDeleted: false,

        },
        data: {

            $addToSet: { friends: friendId }
        },
        options: {
            new: true,
        }
    })


    return successresponse(res,);
});




export const getprofile = asyncHandelr(async (req, res, next) => {
    const user = await dbservice.findOne({
        model: Usermodel,
        filter: { _id: req.user._id },  // استخدام _id بدلاً من userId
        select: "username  _id ",  // تأكد من جلب friends

        populate: [
            {
                path: "friends",
                select: "username profilePic _id"  // تعبئة بيانات الأصدقاء فقط
            }
        ]
    });

    if (!user) {
        return next(new Error("User not found", { cause: 404 }));
    }

    return successresponse(res, { friends:user.friends });
});



export const addToFavorite = async (req, res, next) => {
    try {
        const { productId } = req.body;
        const userId = req.user._id; // استخراج userId من التوكن

        if (!productId) {
            return res.status(400).json({ message: "❌ يجب إدخال معرف المنتج!" });
        }

        const product = await ProductModel.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "❌ المنتج غير موجود!" });
        }

        const isExist = await FavoriteModel.findOne({ user: userId, product: productId });
        if (isExist) {
            return res.status(400).json({ message: "⚠️ المنتج مضاف بالفعل إلى المفضلة!" });
        }

        const favorite = await FavoriteModel.create({ user: userId, product: productId });

        return res.status(201).json({
            message: "✅ تم إضافة المنتج إلى المفضلة بنجاح!",
           
        });
    } catch (error) {
        next(error);
    }
};

export const removeFromFavorite = async (req, res, next) => {
    try {
        const { productId } = req.body;
        const userId = req.user._id; // استخراج userId من التوكن

        if (!productId) {
            return res.status(400).json({ message: "❌ يجب إدخال معرف المنتج!" });
        }

        const favorite = await FavoriteModel.findOneAndDelete({ user: userId, product: productId });

        if (!favorite) {
            return res.status(404).json({ message: "❌ المنتج غير موجود في المفضلة!" });
        }

        return res.status(200).json({ message: "✅ تم حذف المنتج من المفضلة بنجاح!" });
    } catch (error) {
        next(error);
    }
};

export const getUserFavorites = async (req, res, next) => {
    try {
        const userId = req.user._id;

        const favorites = await FavoriteModel.find({ user: userId })
            .populate("product")
            .sort({ createdAt: -1 });

        // حذف العناصر اللي product فيها null
        const filteredFavorites = favorites.filter(fav => fav.product !== null);

        if (filteredFavorites.length === 0) {
            return res.status(404).json({ message: "❌ لا توجد منتجات مفضلة حتى الآن!" });
        }

        return res.status(200).json({
            message: "✅ تم جلب المنتجات المفضلة بنجاح!",
            data: filteredFavorites
        });
    } catch (error) {
        next(error);
    }
};



admin.initializeApp({
    credential: admin.credential.cert({
        type: process.env.FIREBASE_TYPE,
        project_id: process.env.FIREBASE_PROJECT_ID,
        private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
        private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        client_id: process.env.FIREBASE_CLIENT_ID,
        auth_uri: process.env.FIREBASE_AUTH_URI,
        token_uri: process.env.FIREBASE_TOKEN_URI,
        auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
        client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
        universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN,
    }),
});
async function sendNotification(deviceToken, title, body) {
    const message = {
        notification: { title, body },
        token: deviceToken,
    };

    try {
        const response = await admin.messaging().send(message);
        console.log('✅ تم إرسال الإشعار:', response);
    } catch (error) {
        console.error('❌ فشل إرسال الإشعار:', error);
    }
}

// sendNotification('ftrRnnUPRfKrE41oSTUcz7:APA91bGDa5hYvCiGIM2yRlqIOcq5D_kYpDsueiPrFlJZ5vyHNT9hCKIG7sYVyEf2ZNZsfEHv9kREmzCYSfoeq82fyjl47orndHZFHfSpCLEH29obiHam1-k', 'عنوان الإشعار', 'نص الإشعار هنا');

export const savetoken = asyncHandelr(async (req, res, next) => {
    const { userId, fcmToken } = req.body;

    if (!userId || !fcmToken) {
        return res.status(400).json({ message: "userId و fcmToken مطلوبين" });
    }

    try {
        await Usermodel.findByIdAndUpdate(userId, { fcmToken });
        res.json({ message: "تم حفظ التوكن بنجاح" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "حدث خطأ أثناء حفظ التوكن" });
    }

});


export const deleteFcmToken = asyncHandelr(async (req, res) => {
    const userId = req.user._id;

    try {
        const user = await Usermodel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "❌ المستخدم غير موجود!" });
        }

        user.fcmToken = null; // 🧹 حذف التوكن
        await user.save();

        res.status(200).json({ message: "✅ تم حذف FCM Token بنجاح" });
    } catch (error) {
        console.error("❌ خطأ أثناء حذف التوكن:", error);
        res.status(500).json({ message: "حدث خطأ أثناء حذف التوكن", error: error.message });
    }
});
