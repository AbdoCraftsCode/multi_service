import { json } from "express";
import Joi from 'joi';
import { generalfields } from "../../middlewere/validation.middlewere.js";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export const signup = Joi.object().keys({
    // classId:generalfields.classId.required(),
    username: generalfields.username.required(),

    email: generalfields.email.required(),
    password: generalfields.password.required(),
    confirmationpassword: generalfields.confirmationpassword.required()


}



).required()




export const login = Joi.object().keys({



    email: generalfields.email.required(),
    password: generalfields.password.required(),



}



).required()




export const confirmemail = Joi.object().keys({

    code: Joi.string().required(),

    email: generalfields.email.required(),



}).required()


export const newotp = Joi.object().keys({



    email: generalfields.email.required(),



}).required()          








// import axios from "axios";
// import dotenv from "dotenv";
// import readline from "readline";

dotenv.config();





const AUTHENTICA_API_KEY = process.env.AUTHENTICA_API_KEY || "$2y$10$jyvf/ULRPzS/EaID5fvssOICMtHl.zVDevOecSvpJA6h9tPWsaeRa";
const AUTHENTICA_OTP_URL = "https://api.authentica.sa/api/v1/send-otp";

async function sendOTP(phone) {
    try {
        const response = await axios.post(
            AUTHENTICA_OTP_URL,
            {
                phone: phone,
                method: "whatsapp",  // ممكن تغيرها لـ "sms" حسب اللي تريده
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
    } catch (error) {
        console.error("❌ فشل في إرسال OTP:", error.response?.data || error.message);
    }
}




