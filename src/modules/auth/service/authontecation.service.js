import Usermodel, { providerTypes, roletypes } from "../../../DB/models/User.model.js";
import * as dbservice from "../../../DB/dbservice.js"
import { asyncHandelr } from "../../../utlis/response/error.response.js";
import { comparehash, generatehash } from "../../../utlis/security/hash.security.js";
import { successresponse } from "../../../utlis/response/success.response.js";
import {  decodedToken,  generatetoken,  tokenTypes } from "../../../utlis/security/Token.security.js";
import { Emailevent } from "../../../utlis/events/email.emit.js";
import { OAuth2Client } from "google-auth-library";
import axios from "axios";
import OtpModel from "../../../DB/models/otp.model.js";
import { nanoid, customAlphabet } from "nanoid";
import { vervicaionemailtemplet } from "../../../utlis/temblete/vervication.email.js";
import { sendemail } from "../../../utlis/email/sendemail.js";
import { RestaurantModel } from "../../../DB/models/RestaurantSchema.model.js";
import { sendOTP } from "./regestration.service.js";
import AppSettingsSchema from "../../../DB/models/AppSettingsSchema.js";
const AUTHENTICA_OTP_URL = "https://api.authentica.sa/api/v1/send-otp";
// export const login = asyncHandelr(async (req, res, next) => {
//     const { identifier, password } = req.body; // identifier يمكن أن يكون إيميل أو رقم هاتف
//     console.log(identifier, password);

//     const checkUser = await Usermodel.findOne({
//         $or: [{ email: identifier }, { phone: identifier }]
//     });

//     if (!checkUser) {
//         return next(new Error("User not found", { cause: 404 }));
//     }

//     if (checkUser?.provider === providerTypes.google) {
//         return next(new Error("Invalid account", { cause: 404 }));
//     }

//     if (!checkUser.isConfirmed) {
//         return next(new Error("Please confirm your email tmm ", { cause: 404 }));
//     }

//     if (!comparehash({ planText: password, valuehash: checkUser.password })) {
//         return next(new Error("Password is incorrect", { cause: 404 }));
//     }

//     const access_Token = generatetoken({
//         payload: { id: checkUser._id },
//         // signature: checkUser.role === roletypes.Admin ? process.env.SYSTEM_ACCESS_TOKEN : process.env.USER_ACCESS_TOKEN,
//     });

//     const refreshToken = generatetoken({
//         payload: { id: checkUser._id },
//         // signature: checkUser.role === roletypes.Admin ? process.env.SYSTEM_REFRESH_TOKEN : process.env.USER_REFRESH_TOKEN,
//         expiresIn: "365d"
//     });

//     return successresponse(res, "Done", 200, { access_Token, refreshToken, checkUser });
// });








// export const login = asyncHandelr(async (req, res, next) => {
//     const { identifier, password } = req.body; // identifier ممكن يكون إيميل أو رقم هاتف
//     console.log(identifier, password);

//     const checkUser = await Usermodel.findOne({
//         $or: [{ email: identifier }, { phone: identifier }]
//     });

//     if (!checkUser) {
//         return next(new Error("User not found", { cause: 404 }));
//     }

//     if (checkUser?.provider === providerTypes.google) {
//         return next(new Error("Invalid account", { cause: 404 }));
//     }

//     // ✅ تحقق من حالة التأكيد
//     if (!checkUser.isConfirmed) {
//         try {
//             if (checkUser.phone) {
//                 // ✅ إرسال OTP للهاتف
//                 await sendOTP(checkUser.phone);
//                 console.log(`📩 OTP تم إرساله إلى الهاتف: ${checkUser.phone}`);
//             } else if (checkUser.email) {
//                 // ✅ إنشاء OTP جديد للبريد
//                 const otp = customAlphabet("0123456789", 6)();
//                 const html = vervicaionemailtemplet({ code: otp });

//                 const emailOTP = await generatehash({ planText: `${otp}` });
//                 const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

//                 await Usermodel.updateOne(
//                     { _id: checkUser._id },
//                     { emailOTP, otpExpiresAt, attemptCount: 0 }
//                 );

//                 await sendemail({
//                     to: checkUser.email,
//                     subject: "Confirm Email",
//                     text: "رمز التحقق الخاص بك",
//                     html,
//                 });

//                 console.log(`📩 OTP تم إرساله إلى البريد: ${checkUser.email}`);
//             }

//             return successresponse(
//                 res,
//                 "الحساب غير مفعل، تم إرسال رمز التحقق من جديد",
//                 200,
//                 { status: "notverified" }
//             );
//         } catch (error) {
//             console.error("❌ فشل في إرسال OTP أثناء تسجيل الدخول:", error.message);
//             return next(new Error("فشل في إرسال رمز التحقق", { cause: 500 }));
//         }
//     }

//     // ✅ التحقق من كلمة المرور
//     if (!comparehash({ planText: password, valuehash: checkUser.password })) {
//         return next(new Error("Password is incorrect", { cause: 404 }));
//     }

//     // ✅ إنشاء التوكنات
//     const access_Token = generatetoken({
//         payload: { id: checkUser._id },
//     });

//     const refreshToken = generatetoken({
//         payload: { id: checkUser._id },
//         expiresIn: "365d"
//     });

//     return successresponse(res, "Done", 200, { access_Token, refreshToken, checkUser });
// });





// export const login = asyncHandelr(async (req, res, next) => {
//     const { identifier, password } = req.body; // identifier ممكن يكون إيميل أو رقم هاتف
//     const { fedk, fedkdrivers } = req.query; // ✅ الحقلين الجدد من query
//     console.log(identifier, password);

//     // ✅ إعداد الفلتر الأساسي
//     let baseFilter = {
//         $or: [{ email: identifier }, { phone: identifier }]
//     };

//     // ✅ لو الحقل fedk موجود → نبحث عن User أو ServiceProvider (Host, Doctor)
//     if (fedk) {
//         baseFilter.$or = [
//             { email: identifier, accountType: "User" },
//             { phone: identifier, accountType: "User" },
//             { email: identifier, accountType: "ServiceProvider", serviceType: { $in: ["Host", "Doctor"] } },
//             { phone: identifier, accountType: "ServiceProvider", serviceType: { $in: ["Host", "Doctor"] } }
//         ];
//     }

//     // ✅ لو الحقل fedkdrivers موجود → نبحث عن ServiceProvider (Driver, Delivery)
//     if (fedkdrivers) {
//         baseFilter.$or = [
//             { email: identifier, accountType: "ServiceProvider", serviceType: { $in: ["Driver", "Delivery"] } },
//             { phone: identifier, accountType: "ServiceProvider", serviceType: { $in: ["Driver", "Delivery"] } }
//         ];
//     }

//     const checkUser = await Usermodel.findOne(baseFilter);

//     if (!checkUser) {
//         return next(new Error("User not found", { cause: 404 }));
//     }

//     if (checkUser?.provider === providerTypes.google) {
//         return next(new Error("Invalid account", { cause: 404 }));
//     }

//     // ✅ تحقق من حالة التأكيد
//     if (!checkUser.isConfirmed) {
//         try {
//             if (checkUser.phone) {
//                 // ✅ إرسال OTP للهاتف
//                 await sendOTP(checkUser.phone);
//                 console.log(`📩 OTP تم إرساله إلى الهاتف: ${checkUser.phone}`);
//             } else if (checkUser.email) {
//                 // ✅ إنشاء OTP جديد للبريد
//                 const otp = customAlphabet("0123456789", 6)();
//                 const html = vervicaionemailtemplet({ code: otp });

//                 const emailOTP = await generatehash({ planText: `${otp}` });
//                 const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

//                 await Usermodel.updateOne(
//                     { _id: checkUser._id },
//                     { emailOTP, otpExpiresAt, attemptCount: 0 }
//                 );

//                 await sendemail({
//                     to: checkUser.email,
//                     subject: "Confirm Email",
//                     text: "رمز التحقق الخاص بك",
//                     html,
//                 });

//                 console.log(`📩 OTP تم إرساله إلى البريد: ${checkUser.email}`);
//             }

//             return successresponse(
//                 res,
//                 "الحساب غير مفعل، تم إرسال رمز التحقق من جديد",
//                 200,
//                 { status: "notverified" }
//             );
//         } catch (error) {
//             console.error("❌ فشل في إرسال OTP أثناء تسجيل الدخول:", error.message);
//             return next(new Error("فشل في إرسال رمز التحقق", { cause: 500 }));
//         }
//     }

//     // ✅ التحقق من كلمة المرور
//     if (!comparehash({ planText: password, valuehash: checkUser.password })) {
//         return next(new Error("Password is incorrect", { cause: 404 }));
//     }

//     // ✅ إنشاء التوكنات
//     const access_Token = generatetoken({
//         payload: { id: checkUser._id },
//     });

//     const refreshToken = generatetoken({
//         payload: { id: checkUser._id },
//         expiresIn: "365d"
//     });

//     return successresponse(res, "Done", 200, { access_Token, refreshToken, checkUser });
// });





export const login = asyncHandelr(async (req, res, next) => {
    const { identifier, password } = req.body; // identifier ممكن يكون إيميل أو رقم هاتف
    const { fedk, fedkdrivers } = req.query; // ✅ الحقلين الجدد من query
    console.log(identifier, password);

    // ✅ إعداد الفلتر الأساسي
    let baseFilter = {
        $or: [{ email: identifier }, { phone: identifier }]
    };

    // ✅ لو الحقل fedk موجود → نبحث عن User أو ServiceProvider (Host, Doctor)
    if (fedk) {
        baseFilter.$or = [
            { email: identifier, accountType: "User" },
            { phone: identifier, accountType: "User" },
            { email: identifier, accountType: "ServiceProvider", serviceType: { $in: ["Host", "Doctor"] } },
            { phone: identifier, accountType: "ServiceProvider", serviceType: { $in: ["Host", "Doctor"] } }
        ];
    }

    // ✅ لو الحقل fedkdrivers موجود → نبحث عن ServiceProvider (Driver, Delivery)
    if (fedkdrivers) {
        baseFilter.$or = [
            { email: identifier, accountType: "ServiceProvider", serviceType: { $in: ["Driver", "Delivery"] } },
            { phone: identifier, accountType: "ServiceProvider", serviceType: { $in: ["Driver", "Delivery"] } }
        ];
    }

    const checkUser = await Usermodel.findOne(baseFilter);

    if (!checkUser) {
        return next(new Error("User not found", { cause: 404 }));
    }

    // ✅ لو المستخدم staff أو manager → تسجيل مباشر بدون تحقق OTP أو شروط إضافية
    if (checkUser.accountType === "staff" || checkUser.accountType === "manager") {
        if (!comparehash({ planText: password, valuehash: checkUser.password })) {
            return next(new Error("Password is incorrect", { cause: 404 }));
        }

        const access_Token = generatetoken({
            payload: { id: checkUser._id },
        });

        const refreshToken = generatetoken({
            payload: { id: checkUser._id },
            expiresIn: "365d"
        });

        return successresponse(res, "✅ Staff or Manager logged in successfully", 200, {
            access_Token,
            refreshToken,
            checkUser
        });
    }

    if (checkUser?.provider === providerTypes.google) {
        return next(new Error("Invalid account", { cause: 404 }));
    }

    // ✅ تحقق من حالة التأكيد
    if (!checkUser.isConfirmed) {
        try {
            if (checkUser.phone) {
                // ✅ إرسال OTP للهاتف
                await sendOTP(checkUser.phone);
                console.log(`📩 OTP تم إرساله إلى الهاتف: ${checkUser.phone}`);
            } else if (checkUser.email) {
                // ✅ إنشاء OTP جديد للبريد
                const otp = customAlphabet("0123456789", 4)();
                const html = vervicaionemailtemplet({ code: otp });

                const emailOTP = await generatehash({ planText: `${otp}` });
                const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

                await Usermodel.updateOne(
                    { _id: checkUser._id },
                    { emailOTP, otpExpiresAt, attemptCount: 0 }
                );

                await sendemail({
                    to: checkUser.email,
                    subject: "Confirm Email",
                    text: "رمز التحقق الخاص بك",
                    html,
                });

                console.log(`📩 OTP تم إرساله إلى البريد: ${checkUser.email}`);
            }

            return successresponse(
                res,
                "الحساب غير مفعل، تم إرسال رمز التحقق من جديد",
                200,
                { status: "notverified" }
            );
        } catch (error) {
            console.error("❌ فشل في إرسال OTP أثناء تسجيل الدخول:", error.message);
            return next(new Error("فشل في إرسال رمز التحقق", { cause: 500 }));
        }
    }

    // ✅ التحقق من كلمة المرور
    if (!comparehash({ planText: password, valuehash: checkUser.password })) {
        return next(new Error("Password is incorrect", { cause: 404 }));
    }

    // ✅ إنشاء التوكنات
    const access_Token = generatetoken({
        payload: { id: checkUser._id },
    });

    const refreshToken = generatetoken({
        payload: { id: checkUser._id },
        expiresIn: "365d"
    });

    return successresponse(res, "Done", 200, { access_Token, refreshToken, checkUser });
});








export const loginAdmin = asyncHandelr(async (req, res, next) => {
    const { identifier, password } = req.body; // identifier يمكن أن يكون إيميل أو رقم هاتف
    console.log(identifier, password);

    const checkUser = await Usermodel.findOne({
        $or: [{ email: identifier }, { phone: identifier }]
    });

    if (!checkUser) {
        return next(new Error("User not found", { cause: 404 }));
    }

    if (checkUser?.provider === providerTypes.google) {
        return next(new Error("Invalid account", { cause: 404 }));
    }

    if (!checkUser.isConfirmed) {
        return next(new Error("Please confirm your email tmm ", { cause: 404 }));
    }

    // 🔒 شرط السماح بالدخول فقط لـ Owner أو Admin
    if (!["Owner", "Admin"].includes(checkUser.accountType)) {
        return next(new Error("غير مسموح لك بتسجيل الدخول", { cause: 403 }));
    }

    if (!comparehash({ planText: password, valuehash: checkUser.password })) {
        return next(new Error("Password is incorrect", { cause: 404 }));
    }

    const access_Token = generatetoken({
        payload: { id: checkUser._id },
    });

    const refreshToken = generatetoken({
        payload: { id: checkUser._id },
        expiresIn: "365d"
    });

    return successresponse(res, "Done", 200, { access_Token, refreshToken, checkUser });
});

// export const loginwithGmail = asyncHandelr(async (req, res, next) => {
//     const { idToken } = req.body;
//     const client = new OAuth2Client();

//     async function verify() {
//         const ticket = await client.verifyIdToken({
//             idToken,
//             audience: process.env.CIENT_ID,
//         });
//         return ticket.getPayload();
//     }

//     const payload = await verify();
//     console.log("Google Payload Data:", payload);

//     const { name, email, email_verified, picture } = payload;

//     if (!email) {
//         return next(new Error("Email is missing in Google response", { cause: 400 }));
//     }
//     if (!email_verified) {
//         return next(new Error("Email not verified", { cause: 404 }));
//     }

//     let user = await dbservice.findOne({
//         model: Usermodel,
//         filter: { email },
//     });

//     if (user?.provider === providerTypes.system) {
//         return next(new Error("Invalid account", { cause: 404 }));
//     }

//     if (!user) {
//         user = await dbservice.create({
//             model: Usermodel,
//             data: {
//                 email,
//                 username: name,
//                 profilePic: { secure_url: picture },
//                 isConfirmed: email_verified,
//                 provider: providerTypes.google,
//             },
//         });
//     }

//     const access_Token = generatetoken({
//         payload: { id: user._id },
//         // signature: user?.role === roletypes.Admin ? process.env.SYSTEM_ACCESS_TOKEN : process.env.USER_ACCESS_TOKEN,
//     });

//     const refreshToken = generatetoken({
//         payload: { id: user._id },
//         // signature: user?.role === roletypes.Admin ? process.env.SYSTEM_REFRESH_TOKEN : process.env.USER_REFRESH_TOKEN,
//         expiresIn: "365d"
//     });
//     return successresponse(res, "Login successful", 200, { access_Token, refreshToken })

// });

export const refreshToken = asyncHandelr(async (req, res, next) => {

    const user = await decodedToken({ authorization: req.headers.authorization, tokenType: tokenTypes.refresh })

    const accessToken = generatetoken({
        payload: { id: user._id },
        // signature: user.role === 'Admin' ? process.env.SYSTEM_ACCESS_TOKEN : process.env.USER_ACCESS_TOKEN,
    });

    // 7. إنشاء refresh token جديد
    const newRefreshToken = generatetoken({
        payload: { id: user._id },
        // signature: user.role === 'Admin' ? process.env.SYSTEM_REFRESH_TOKEN : process.env.USER_REFRESH_TOKEN,
        expiresIn: "365d"// سنة واحدة
    });

    // 8. إرجاع الرد الناجح
    return successresponse(res, "Token refreshed successfully", 200, { accessToken, refreshToken: newRefreshToken });
});


 
export const forgetpassword = asyncHandelr(async (req, res, next) => {
    const { email } = req.body;
    console.log(email);

    const checkUser = await Usermodel.findOne({ email });
    if (!checkUser) {
        return next(new Error("User not found", { cause: 404 }));
    }

    Emailevent.emit("forgetpassword", { email })

    return successresponse(res);
});




export const resetpassword = asyncHandelr(async (req, res, next) => {
    const { email, password, code } = req.body;
    console.log(email, password, code);

    const checkUser = await Usermodel.findOne({ email });
    if (!checkUser) {
        return next(new Error("User not found", { cause: 404 }));
    }

    if (!comparehash({ planText: code, valuehash: checkUser.forgetpasswordOTP })) {

        return next(new Error("code not match", { cause: 404 }));
    }

    const hashpassword = generatehash({ planText: password })
    await Usermodel.updateOne({ email }, {

        password: hashpassword,
        isConfirmed: true,
        changeCredentialTime: Date.now(),
        $unset: { forgetpasswordOTP: 0, otpExpiresAt: 0, attemptCount: 0 },

    })

    return successresponse(res);
});


export const resendOTP = asyncHandelr(async (req, res, next) => {
    const { email } = req.body;
    console.log(email);

    const checkUser = await Usermodel.findOne({ email });
    if (!checkUser) {
        return next(new Error("User not found", { cause: 404 }));
    }

    
    if (checkUser.otpExpiresAt && checkUser.otpExpiresAt > Date.now()) {
        return next(new Error("Please wait before requesting a new code", { cause: 429 }));
    }


    const otp = customAlphabet("0123456789", 6)();
    const forgetpasswordOTP = generatehash({ planText: otp });

  
    const otpExpiresAt = new Date(Date.now() + 2 * 60 * 1000);

 
    await Usermodel.updateOne(
        { email },
        {
            forgetpasswordOTP,
            otpExpiresAt,
            attemptCount: 0
        }
    );


    const html = vervicaionemailtemplet({ code: otp });
    await sendemail({ to: email, subject: "Resend OTP", html });

    console.log("OTP resent successfully!");
    return successresponse(res, "A new OTP has been sent to your email.");
});

// $2y$10$ZHEfQKrayDl6V3JwOwnyreovYvhG.zTMW6mIedMEOjjoTr2R367Zy

// const AUTHENTICA_API_KEY = process.env.AUTHENTICA_API_KEY || "$2y$10$q3BAdOAyWapl3B9YtEVXK.DHmJf/yaOqF4U.MpbBmR8bwjSxm4A6W";
// const AUTHENTICA_VERIFY_URL = "https://api.authentica.sa/api/v1/verify-otp";

// export const verifyOTP = async (req, res, next) => {
//     const { phone, otp } = req.body;

//     if (!phone || !otp) {
//         return res.status(400).json({ success: false, error: "❌ يجب إدخال رقم الهاتف و OTP" });
//     }

//     try {
//         const user = await dbservice.findOne({
//             model: Usermodel,
//             filter: { mobileNumber: phone }
//         });

//         if (!user) {
//             return next(new Error("❌ رقم الهاتف غير مسجل", { cause: 404 }));
//         }

//         console.log("📨 جاري التحقق من OTP بالبيانات:", { phone, otp, session_id: undefined });

//         const response = await axios.post(
//             AUTHENTICA_VERIFY_URL,
//             {
//                 phone,
//                 otp,
//                 session_id: undefined  // مؤقتًا نرسله undefined حتى نعرف من الرد هل هو مطلوب
//             },
//             {
//                 headers: {
//                     "X-Authorization": AUTHENTICA_API_KEY,
//                     "Content-Type": "application/json",
//                     "Accept": "application/json"
//                 },
//             }
//         );

//         console.log("📩 استجابة API من AUTHENTICA:", JSON.stringify(response.data, null, 2));

//         if (response.data.status === true && response.data.message === "OTP verified successfully") {
//             await dbservice.updateOne({
//                 model: Usermodel,
//                 filter: { mobileNumber: phone },
//                 data: { isConfirmed: true }
//             });

//             const access_Token = generatetoken({ payload: { id: user._id } });
//             const refreshToken = generatetoken({ payload: { id: user._id }, expiresIn: "365d" });

//             return res.json({
//                 success: true,
//                 message: "✅ OTP صحيح، تم التحقق بنجاح!",
//                 access_Token,
//                 refreshToken
//             });
//         } else {
//             return res.status(400).json({
//                 success: false,
//                 message: "❌ OTP غير صحيح",
//                 details: response.data
//             });
//         }
//     } catch (error) {
//         console.error("❌ فشل التحقق من OTP:", error.response?.data || error.message);

//         return res.status(500).json({
//             success: false,
//             error: "❌ فشل التحقق من OTP",
//             details: error.response?.data || error.message
//         });
//     }
// };



const AUTHENTICA_API_KEY = "ad5348edf3msh15d5daec987b64cp183e9fjsne1092498134c";
const AUTHENTICA_BASE_URL = "https://authentica1.p.rapidapi.com/api/v2";
export async function verifyOTP(phone, otp) {
    try {
        const response = await axios.post(
            `${AUTHENTICA_BASE_URL}/verify-otp`,
            {
                phone: phone,
                otp: otp,
            },
            {
                headers: {
                    "x-rapidapi-key": AUTHENTICA_API_KEY,
                    "x-rapidapi-host": "authentica1.p.rapidapi.com",
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            }
        );

        console.log("✅ OTP Verified:", response.data);
        return response.data;
    } catch (error) {
        console.error(
            "❌ OTP Verification Failed:",
            error.response?.data || error.message
        );
        throw error;
    }
}



// export const confirEachOtp = asyncHandelr(async (req, res, next) => {
//     const { code, email, phone } = req.body;

//     if (!code || (!email && !phone)) {
//         return next(new Error("يرجى إدخال الكود ورقم الهاتف أو البريد الإلكتروني", { cause: 400 }));
//     }

//     // ✅ تحقق عن طريق الهاتف باستخدام AUTHENTICA
//     if (phone) {
//         const user = await dbservice.findOne({
//             model: Usermodel,
//             isConfirmed: false,
//             filter: { phone }
//         });

//         if (!user) {
//             return next(new Error("رقم الهاتف غير مسجل", { cause: 404 }));
//         }

//         try {
//             const response = await axios.post(
//                 "https://api.authentica.sa/api/v1/verify-otp",
//                 {
//                     phone,
//                     otp: code,
//                     session_id: undefined
//                 },
//                 {
//                     headers: {
//                         "X-Authorization": process.env.AUTHENTICA_API_KEY,
//                         "Content-Type": "application/json",
//                         "Accept": "application/json"
//                     }
//                 }
//             );

//             console.log("📩 AUTHENTICA response:", response.data);

//             if (response.data.status === true && response.data.message === "OTP verified successfully") {
//                 await dbservice.updateOne({
//                     model: Usermodel,
//                     filter: { phone },
//                     data: { isConfirmed: true }
//                 });

//                 const access_Token = generatetoken({ payload: { id: user._id } });
//                 const refreshToken = generatetoken({ payload: { id: user._id }, expiresIn: "365d" });

//                 return successresponse(res, "✅ تم التحقق من رقم الهاتف بنجاح", 200, {
//                     access_Token,
//                     refreshToken,
//                     user
//                 });
//             } else {
//                 return next(new Error("❌ كود التحقق غير صحيح", { cause: 400 }));
//             }

//         } catch (error) {
//             console.error("❌ AUTHENTICA Error:", error.response?.data || error.message);
//             return next(new Error("❌ فشل التحقق من OTP عبر الهاتف", { cause: 500 }));
//         }
//     }

//     // ✅ تحقق عن طريق البريد الإلكتروني (محلي)
//     if (email) {
//         const user = await dbservice.findOne({ model: Usermodel, isConfirmed: false, filter: { email } });

//         if (!user) return next(new Error("البريد الإلكتروني غير مسجل", { cause: 404 }));

//         if (user.isConfirmed) return next(new Error("البريد الإلكتروني مؤكد بالفعل", { cause: 400 }));

//         if (Date.now() > new Date(user.otpExpiresAt).getTime()) {
//             return next(new Error("انتهت صلاحية الكود", { cause: 400 }));
//         }

//         const isValidOTP = comparehash({ planText: `${code}`, valuehash: user.emailOTP });
//         if (!isValidOTP) {
//             const attempts = (user.attemptCount || 0) + 1;

//             if (attempts >= 5) {
//                 await Usermodel.updateOne({ email }, {
//                     blockUntil: new Date(Date.now() + 2 * 60 * 1000),
//                     attemptCount: 0
//                 });
//                 return next(new Error("تم حظرك مؤقتًا بعد محاولات خاطئة كثيرة", { cause: 429 }));
//             }

//             await Usermodel.updateOne({ email }, { attemptCount: attempts });
//             return next(new Error("كود التحقق غير صحيح", { cause: 400 }));
//         }

//         await Usermodel.updateOne({ email }, {
//             isConfirmed: true,
//             $unset: { emailOTP: 0, otpExpiresAt: 0, attemptCount: 0, blockUntil: 0 }
//         });

//         const access_Token = generatetoken({ payload: { id: user._id } });
//         const refreshToken = generatetoken({ payload: { id: user._id }, expiresIn: "365d" });

//         return successresponse(res, "✅ تم تأكيد البريد الإلكتروني بنجاح", 200, {
//             access_Token,
//             refreshToken,
//             user
//         });
//     }
// });


export const confirEachOtp = asyncHandelr(async (req, res, next) => {
    const { code, email, phone } = req.body;
    const { fedk, fedkdrivers } = req.query;

    if (!code || (!email && !phone)) {
        return next(new Error("يرجى إدخال الكود ورقم الهاتف أو البريد الإلكتروني", { cause: 400 }));
    }

    let baseFilter = {};
    if (email) baseFilter.email = email;
    if (phone) baseFilter.phone = phone;

    if (fedk) {
        baseFilter.$or = [
            { accountType: "User" },
            { accountType: "ServiceProvider", serviceType: { $in: ["Host", "Doctor"] } }
        ];
    }

    if (fedkdrivers) {
        baseFilter.$or = [
            { accountType: "ServiceProvider", serviceType: { $in: ["Driver", "Delivery"] } }
        ];
    }

    // ✅ تحقق عن طريق الهاتف
    if (phone) {
        const user = await dbservice.findOne({
            model: Usermodel,
            filter: baseFilter
        });

        if (!user) return next(new Error("رقم الهاتف غير مسجل", { cause: 404 }));

        if (user.isConfirmed) {
            return successresponse(res, "✅ رقم الهاتف تم تأكيده مسبقًا", 200, { user });
        }

        try {
            const response = await axios.post(
                "https://authentica1.p.rapidapi.com/api/v2/verify-otp",
                { phone, otp: code },
                {
                    headers: {
                        "x-rapidapi-key": process.env.AUTHENTICA_API_KEY,
                        "x-rapidapi-host": "authentica1.p.rapidapi.com",
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                    },
                }
            );

            console.log("📩 AUTHENTICA response:", response.data);

           if (response.data?.status === true || response.data?.message === "OTP verified successfully") {
                await dbservice.updateOne({
                    model: Usermodel,
                    filter: { _id: user._id },
                    data: { isConfirmed: true },
                });

                const access_Token = generatetoken({ payload: { id: user._id } });
                const refreshToken = generatetoken({
                    payload: { id: user._id },
                    expiresIn: "365d",
                });

                return successresponse(res, "✅ تم التحقق من رقم الهاتف بنجاح", 200, {
                    access_Token,
                    refreshToken,
                    user,
                });
            } else {
                return next(new Error("❌ كود التحقق غير صحيح", { cause: 400 }));
            }

        } catch (error) {
            console.error("❌ AUTHENTICA Error:", error.response?.data || error.message);
            return next(new Error("❌ فشل التحقق من OTP عبر الهاتف", { cause: 500 }));
        }
    }

    // ✅ تحقق عن طريق البريد الإلكتروني
    if (email) {
        const user = await dbservice.findOne({
            model: Usermodel,
            filter: baseFilter
        });

        if (!user) return next(new Error("البريد الإلكتروني غير مسجل", { cause: 404 }));

        if (user.isConfirmed) {
            return successresponse(res, "✅ البريد الإلكتروني تم تأكيده مسبقًا", 200, { user });
        }

        if (Date.now() > new Date(user.otpExpiresAt).getTime()) {
            return next(new Error("انتهت صلاحية الكود", { cause: 400 }));
        }

        const isValidOTP = comparehash({ planText: `${code}`, valuehash: user.emailOTP });
        if (!isValidOTP) {
            const attempts = (user.attemptCount || 0) + 1;
            if (attempts >= 5) {
                await Usermodel.updateOne({ email }, {
                    blockUntil: new Date(Date.now() + 2 * 60 * 1000),
                    attemptCount: 0
                });
                return next(new Error("تم حظرك مؤقتًا بعد محاولات خاطئة كثيرة", { cause: 429 }));
            }

            await Usermodel.updateOne({ email }, { attemptCount: attempts });
            return next(new Error("كود التحقق غير صحيح", { cause: 400 }));
        }

        await Usermodel.updateOne({ _id: user._id }, {
            isConfirmed: true,
            $unset: { emailOTP: 0, otpExpiresAt: 0, attemptCount: 0, blockUntil: 0 }
        });

        const access_Token = generatetoken({ payload: { id: user._id } });
        const refreshToken = generatetoken({ payload: { id: user._id }, expiresIn: "365d" });

        return successresponse(res, "✅ تم تأكيد البريد الإلكتروني بنجاح", 200, {
            access_Token,
            refreshToken,
            user
        });
    }
});










export const forgetPasswordphone = asyncHandelr(async (req, res, next) => {
    const { phone } = req.body;
    console.log(phone);

   
    if (!phone) {
        return next(new Error("❌ يجب إدخال رقم الهاتف", { cause: 400 }));
    }

    // 🔍 البحث عن المستخدم باستخدام رقم الهاتف
    const checkUser = await Usermodel.findOne({ mobileNumber: phone });
    if (!checkUser) {
        return next(new Error("❌ رقم الهاتف غير مسجل", { cause: 404 }));
    }

    // 🔹 إرسال OTP عبر Authentica
    try {
        const response = await axios.post(
            AUTHENTICA_OTP_URL,
            {
                phone: phone,
                method: "whatsapp",  // أو "sms" حسب الحاجة
                number_of_digits: 6,
                otp_format: "numeric",
                is_fallback_on: 0
            },
            {
                headers: {
                    "X-Authorization": AUTHENTICA_API_KEY,
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
            }
        );

        console.log("✅ OTP تم إرساله بنجاح:", response.data);

        return res.json({ success: true, message: "✅ OTP تم إرساله إلى رقم الهاتف بنجاح" });
    } catch (error) {
        console.error("❌ فشل في إرسال OTP:", error.response?.data || error.message);
        return res.status(500).json({
            success: false,
            error: "❌ فشل في إرسال OTP",
            details: error.response?.data || error.message
        });
    }
});



export const forgetPasswordphoneadmin = asyncHandelr(async (req, res, next) => {
    const { phone } = req.body;
    console.log(phone);

    if (!phone) {
        return next(new Error("❌ يجب إدخال رقم الهاتف", { cause: 400 }));
    }

    // 🔍 البحث عن المستخدم باستخدام رقم الهاتف
    const checkUser = await Usermodel.findOne({ mobileNumber: phone });
    if (!checkUser) {
        return next(new Error("❌ رقم الهاتف غير مسجل", { cause: 404 }));
    }

    // ✅ السماح فقط للمستخدمين من نوع Owner أو Admin
    const allowedRoles = ['Owner', 'Admin'];
    if (!allowedRoles.includes(checkUser.role)) {
        return next(new Error("❌ هذا الحساب غير مصرح له بإعادة تعيين كلمة المرور", { cause: 403 }));
    }

    // 🔹 إرسال OTP عبر Authentica
    try {
        const response = await axios.post(
            AUTHENTICA_OTP_URL,
            {
                phone: phone,
                method: "whatsapp",  // أو "sms" حسب الحاجة
                number_of_digits: 6,
                otp_format: "numeric",
                is_fallback_on: 0
            },
            {
                headers: {
                    "X-Authorization": AUTHENTICA_API_KEY,
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
            }
        );

        console.log("✅ OTP تم إرساله بنجاح:", response.data);

        return res.json({ success: true, message: "✅ OTP تم إرساله إلى رقم الهاتف بنجاح" });
    } catch (error) {
        console.error("❌ فشل في إرسال OTP:", error.response?.data || error.message);
        return res.status(500).json({
            success: false,
            error: "❌ فشل في إرسال OTP",
            details: error.response?.data || error.message
        });
    }
});





export const resetPasswordphone= asyncHandelr(async (req, res, next) => {
    const { phone, password, otp } = req.body;

   
    if (!phone || !password || !otp) {
        return next(new Error("❌ جميع الحقول مطلوبة: رقم الهاتف، كلمة المرور، والـ OTP", { cause: 400 }));
    }


    const user = await Usermodel.findOne({ mobileNumber: phone });
    if (!user) {
        return next(new Error("❌ المستخدم غير موجود", { cause: 404 }));
    }

    try {
       
        const response = await axios.post(
            "https://api.authentica.sa/api/v1/verify-otp",
            { phone, otp },
            {
                headers: {
                    "X-Authorization": process.env.AUTHENTICA_API_KEY,
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
            }
        );

        console.log("📩 استجابة API:", response.data);

       
        if (response.data.status === true && response.data.message === "OTP verified successfully") {
            const hashpassword = generatehash({ planText: password });

            await Usermodel.updateOne(
                { mobileNumber: phone },
                {
                    password: hashpassword,
                    isConfirmed: true,
                    changeCredentialTime: Date.now(),
                }
            );

            return successresponse(res, "✅ تم إعادة تعيين كلمة المرور بنجاح", 200);
        } else {
            return next(new Error("❌ OTP غير صحيح", { cause: 400 }));
        }
    } catch (error) {
        console.error("❌ فشل التحقق من OTP:", error.response?.data || error.message);
        return res.status(500).json({
            success: false,
            error: "❌ فشل التحقق من OTP",
            details: error.response?.data || error.message,
        });
    }
});

export const loginwithGmail = asyncHandelr(async (req, res, next) => {
    const { accessToken } = req.body;

    if (!accessToken) {
        return next(new Error("Access token is required", { cause: 400 }));
    }

    // Step 1: Get user info from Google
    let userInfo;
    try {
        const response = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        userInfo = response.data;
    } catch (error) {
        console.error("Failed to fetch user info from Google:", error?.response?.data || error.message);
        return next(new Error("Failed to verify access token with Google", { cause: 401 }));
    }

    const { email, name, picture, email_verified } = userInfo;

    if (!email) {
        return next(new Error("Email is missing in Google response", { cause: 400 }));
    }
    if (!email_verified) {
        return next(new Error("Email not verified", { cause: 403 }));
    }


    let user = await dbservice.findOne({
        model: Usermodel,
        filter: { email },
    });

    if (user?.provider === providerTypes.system) {
        return next(new Error("Invalid account. Please login using your email/password", { cause: 403 }));
    }


    if (!user) {
        let userId;
        let isUnique = false;
        while (!isUnique) {
            userId = Math.floor(1000000 + Math.random() * 9000000);
            const existingUser = await dbservice.findOne({
                model: Usermodel,
                filter: { userId },
            });
            if (!existingUser) isUnique = true;
        }

        user = await dbservice.create({
            model: Usermodel,
            data: {
                email,
                username: name,
                profilePic: { secure_url: picture },
                isConfirmed: email_verified,
                provider: providerTypes.google,
                userId, // ✅ Add generated userId here
                gender: "Male", // لو تقدر تجيبه من جوجل أو تخليه undefined
            },
        });
    }

    // Step 4: Generate tokens
    const access_Token = generatetoken({
        payload: { id: user._id, country: user.country },
    });

    const refreshToken = generatetoken({
        payload: { id: user._id },
        expiresIn: "365d"
    });

    return successresponse(res, "Done", 200, { access_Token, refreshToken, user });
});
 

export const deleteMyAccount = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await Usermodel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "❌ لم يتم العثور على الحساب." });
        }

        // تنفيذ الحذف
        await Usermodel.findByIdAndDelete(userId);

        res.status(200).json({
            message: "✅ تم حذف حسابك بنجاح.",
            deletedUserId: userId,
        });
    } catch (err) {
        console.error("❌ Error in deleteMyAccount:", err);
        res.status(500).json({
            message: "❌ حدث خطأ أثناء حذف الحساب.",
            error: err.message,
        });
    }
};
  

export const loginRestaurant = asyncHandelr(async (req, res, next) => {
    const { email, password } = req.body;
    console.log(email, password);

    // ✅ لازم ترجع كلمة المرور عشان تقدر تقارنها
    const checkUser = await Usermodel.findOne({ email }).select('+password');

    if (!checkUser) {
        return next(new Error("User not found", { cause: 404 }));
    }

    if (!checkUser.isConfirmed) {
        return next(new Error("Please confirm your email tmm ", { cause: 404 }));
    }
    // ✅ قارن كلمة المرور المشفرة
    const isMatch = await comparehash({ planText: password, valuehash: checkUser.password });

    if (!isMatch) {
        return next(new Error("Password is incorrect", { cause: 404 }));
    }

    // ✅ توليد Access Token و Refresh Token
    const access_Token = generatetoken({
        payload: { id: checkUser._id }
    });

    const refreshToken = generatetoken({
        payload: { id: checkUser._id },
        expiresIn: "365d"
    });

    const restaurantLink = `https://morezk12.github.io/Restaurant-system/#/restaurant/${checkUser.subdomain}`;

    // ✅ رجع كل بيانات المستخدم + التوكنات
    const allData = {
        message: "Login successful",
        id: checkUser._id,
        fullName: checkUser.fullName,
        email: checkUser.email,
        phone: checkUser.phone,
        country: checkUser.country,
        subdomain: checkUser.subdomain,
        restaurantLink,
        access_Token,
        refreshToken
    };

    return successresponse(res, allData, 200);
});


export const getMyProfile = async (req, res, next) => {
    try {
        const userId = req.user._id; // ✅ جاي من التوكن

        // هات بيانات المستخدم من الـ DB مع الحقول اللي محتاجها بس
        const user = await Usermodel.findById(userId)
            .select("fullName email phone totalPoints modelcar serviceType carImages profiePicture");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "⚠️ المستخدم غير موجود"
            });
        }

        return res.status(200).json({
            success: true,
            message: "✅ تم جلب البروفايل بنجاح",
            data: user
        });

    } catch (error) {
        next(error);
    }
};













export const getMyCompactProfile = async (req, res, next) => {
    try {
        const userId = req.user._id;

        // جلب الحقول المطلوبة بما فيها subscription
        const user = await Usermodel.findById(userId)
            .select("fullName email phone profiePicture subscription");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "⚠️ المستخدم غير موجود"
            });
        }

        const now = new Date();
        const MS_PER_DAY = 1000 * 60 * 60 * 24;

        // نقرأ مباشرة من subscription
        const startDate = user.subscription?.startDate ? new Date(user.subscription.startDate) : null;
        const endDate = user.subscription?.endDate ? new Date(user.subscription.endDate) : null;
        const planType = user.subscription?.planType || "FreeTrial";

        // حساب الأيام المتبقية والايام المستخدمة فقط لو موجود start و end
        let daysLeft = 0;
        let daysUsed = 0;

        if (startDate && endDate) {
            const diffLeftMs = endDate.getTime() - now.getTime();
            daysLeft = diffLeftMs > 0 ? Math.ceil(diffLeftMs / MS_PER_DAY) : 0;

            const diffUsedMs = now.getTime() - startDate.getTime();
            daysUsed = diffUsedMs > 0 ? Math.floor(diffUsedMs / MS_PER_DAY) : 0;
        }

        return res.status(200).json({
            success: true,
            message: "✅ تم جلب بيانات البروفايل المختصرة بنجاح",
            data: {
                fullName: user.fullName,
                email: user.email,
                phone: user.phone,
                profiePicture: user.profiePicture || null,
                planType,
                daysLeft,
                daysUsed,
                startDate,
                endDate
            }
        });

    } catch (error) {
        next(error);
    }
};




export const createOrUpdateSettings = asyncHandelr(async (req, res, next) => {
    const { whatsappNumber, privacyPolicy } = req.body;

    let settings = await AppSettingsSchema.findOne();
    if (!settings) {
        settings = await AppSettingsSchema.create({ whatsappNumber, privacyPolicy });
    } else {
        settings.whatsappNumber = whatsappNumber || settings.whatsappNumber;
        settings.privacyPolicy = privacyPolicy || settings.privacyPolicy;
        await settings.save();
    }

    return successresponse(res, "✅ تم حفظ الإعدادات بنجاح", 200, { settings });
});


export const getSettings = asyncHandelr(async (req, res, next) => {
    const settings = await AppSettingsSchema.findOne();
    return successresponse(res, "✅ تم جلب الإعدادات بنجاح", 200, { settings });
});