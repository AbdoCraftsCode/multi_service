import Usermodel, { scketConnections } from "../DB/models/User.model.js";
import * as dbservice from "../DB/dbservice.js";
import { tokenTypes, verifytoken } from "../utlis/security/Token.security.js";


export const authenticationSocket = async ({ socket = {}, tokenType = tokenTypes.access } = {}) => {
    try {
        const authHeader = socket.handshake?.auth?.authorization;
        if (!authHeader) {
            return { data: { message: "Authorization header is missing", status: 400 } };
        }

        const [bearer, token] = authHeader.split(" ");
        if (!bearer || !token) {
            return { data: { message: "Invalid authorization format", status: 400 } }
        }

        let accessSignature = "";
        switch (bearer) {
            case 'System':
                accessSignature = process.env.SYSTEM_ACCESS_TOKEN;
                break;
            case 'Bearer':
                accessSignature = process.env.JWT_SECRET;  // ✅ التعديل هنا
                break;
            default:
                return { data: { message: "Invalid bearer type", status: 400 } }
        }

        const decoded = verifytoken({
            token,
            signature: accessSignature
        });

        if (!decoded?.id) {
            return { data: { message: "Invalid token", status: 401 } }
        }

        const user = await dbservice.findOne({
            model: Usermodel,
            filter: { _id: decoded.id, }
        });

        if (!user) {
            return { data: { message: "User not found", status: 404 } }
        }

        // التحقق من تغيير بيانات الاعتماد
        if (user.changecredintialTime?.getTime() >= decoded.iat * 1000) {
            return { data: { message: "Token expired due to credential changes", status: 403 } }
        }

        scketConnections.set(user._id.toString(), socket.id);

        return { data: { user, valid: true } };

    } catch (error) {
        console.error("Socket authentication error:", error);
        return { data: { message: "Internal server error", status: 500 } }
    }
};





export const authorization = (AccessRoles) => {
    return asyncHandelr(async (req, res, next) => {
        if (!AccessRoles.includes(req.user.role)) {


            return { data: { message: "invalid authorization", status: 400 } }

        }


        return next();
    });
};