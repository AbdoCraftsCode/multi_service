import { RestaurantModell } from "../DB/models/productSchema.model.js";
import { roletypes } from "../DB/models/User.model.js";
import { asyncHandelr } from "../utlis/response/error.response.js";
import {  decodedToken } from "../utlis/security/Token.security.js";



export const authentication = () => {
    return asyncHandelr(async (req, res, next) => {
        req.user = await decodedToken({ authorization: req.headers.authorization, next });
        return next();
    });
};

export const checkRestaurantPermission = (allowedRoles = []) => {
    return asyncHandelr(async (req, res, next) => {
        const restaurantId = req.body.restaurantId || req.params.restaurantId || req.query.restaurantId;

        if (!restaurantId) {
            return next(new Error("رقم المطعم مطلوب", { cause: 400 }));
        }

        const restaurant = await RestaurantModell.findById(restaurantId);
        if (!restaurant) {
            return next(new Error("المطعم غير موجود", { cause: 404 }));
        }

        // ✅ لو المستخدم Owner
        if (restaurant.createdBy.toString() === req.user._id.toString()) {
            return next();
        }

        // ✅ لو مستخدم مصرح له
        const authorizedUser = restaurant.authorizedUsers.find(
            (authUser) => authUser.user.toString() === req.user._id.toString()
        );

        if (!authorizedUser) {
            return next(new Error("غير مصرح لك بتنفيذ هذا الإجراء", { cause: 403 }));
        }

        // تحقق من الدور لو محدد
        if (allowedRoles.length && !allowedRoles.includes(authorizedUser.role)) {
            return next(new Error("دورك لا يسمح بتنفيذ هذا الإجراء", { cause: 403 }));
        }

        next();
    });
};


export const authorization = (roletypes) => {
    return asyncHandelr(async (req, res, next) => {
        if (!roletypes.includes(req.user.role)) {

            return next(new Error("invalid authorization", { cause: 400 }));


        }


        return next();
    });
};