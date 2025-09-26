import Joi from "joi";
import { Types } from "mongoose";
const checkObjictId = (value, helper) => {

    return Types.ObjectId.isValid(value) ? true : helper.message("invalid-id")

}

export const generalfields = {
    oldpassword: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{8,}$'))
        .messages({
            "string.pattern.base": "كلمة المرور القديمة يجب أن تتكون من 8 أحرف أو أرقام على الأقل"
        }),
    username: Joi.string().min(2).max(26).trim(),
    classId: Joi.string().required(),

    email: Joi.string().email({ tlds: { allow: ['com', 'net'] }, minDomainSegments: 2, maxDomainSegments: 3 }),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{8,}$')),
    confirmationpassword: Joi.string().valid(Joi.ref('password')),
    id: Joi.string().custom(checkObjictId),
    // ✅ إضافة code (رمز التحقق أو رمز الدولة)
    code: Joi.string().length(6).pattern(/^\d{6}$/).message("يجب أن يكون الكود مكونًا من 6 أرقام فقط"),

    // ✅ إضافة phone (رقم الهاتف مع التحقق من التنسيق)
    phone: Joi.string()
        .pattern(/^(\+?\d{1,3}[- ]?)?\d{10}$/)
        .message("رقم الهاتف غير صالح، يجب أن يكون مكونًا من 10 أرقام على الأقل"),

    // ✅ إضافة DOB (تاريخ الميلاد، يجب أن يكون تاريخًا صحيحًا)
    DOB: Joi.date().less('now').message("تاريخ الميلاد يجب أن يكون تاريخًا صحيحًا في الماضي"),
    gender: Joi.string().valid("male", "female")
}


export const validation = (schema) => {
    return (req, res, next) => {

        const inputData = { ...req.body, ...req.params, ...req.query };

        const validationResult = schema.validate(inputData, { abortEarly: false });

        if (validationResult.error) {

            return res.status(400).json({
                message: "Validation error",
                details: validationResult.error.details
            });
        }
        return next();
    };
}



