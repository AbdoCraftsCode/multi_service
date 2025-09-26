// import { CompanyModel } from "../../../DB/models/Company.model.js";
// import Usermodel from "../../../DB/models/User.model.js";
// import { asyncHandelr } from "../../../utlis/response/error.response.js";
// import { successresponse } from "../../../utlis/response/success.response.js";



// export const banOrUnbanUser = asyncHandelr(async (req, res, next) => {
//     console.log("🔹 req.params:", req.params);
//     console.log("🔹 req.user:", req.user);

//     const { userId } = req.params;
//     const user = req.user;


//     if (user.role !== "Admin") {
//         return next(new Error("❌ Access denied! Only Admins can ban/unban users.", { cause: 403 }));
//     }


//     const targetUser = await Usermodel.findById(userId);
//     if (!targetUser) {
//         return next(new Error("❌ User not found!", { cause: 404 }));
//     }


//     const isBanned = !targetUser.isBanned;
//     targetUser.isBanned = isBanned;
//     targetUser.bannedAt = isBanned ? new Date() : null;

//     await targetUser.save();

//     return successresponse(res, `✅ User ${isBanned ? "banned" : "unbanned"} successfully!`, 200, {
//         userId: targetUser._id,
//         isBanned: targetUser.isBanned,
//         bannedAt: targetUser.bannedAt,
//     });
// });





// export const banOrUnbanCompany = asyncHandelr(async (req, res, next) => {
//     console.log("🔹 req.params:", req.params);
//     console.log("🔹 req.user:", req.user);

//     const { companyId } = req.params;
//     const user = req.user;

//     if (user.role !== "Admin") {
//         return next(new Error("❌ Access denied! Only Admins can ban/unban companies.", { cause: 403 }));
//     }


//     const company = await CompanyModel.findById(companyId);
//     if (!company) {
//         return next(new Error("❌ Company not found!", { cause: 404 }));
//     }


//     const isBanned = !company.isBanned;
//     company.isBanned = isBanned;
//     company.bannedAt = isBanned ? new Date() : null;

//     await company.save();

//     return successresponse(res, `✅ Company ${isBanned ? "banned" : "unbanned"} successfully!`, 200, {
//         companyId: company._id,
//         isBanned: company.isBanned,
//         bannedAt: company.bannedAt,
//     });
// });




// export const approveCompany = asyncHandelr(async (req, res, next) => {
//     console.log("🔹 req.params:", req.params);
//     console.log("🔹 req.user:", req.user);

//     const { companyId } = req.params;
//     const user = req.user;


//     if (user.role !== "Admin") {
//         return next(new Error("❌ Access denied! Only Admins can approve companies.", { cause: 403 }));
//     }

//     const company = await CompanyModel.findById(companyId);
//     if (!company) {
//         return next(new Error("❌ Company not found!", { cause: 404 }));
//     }

   
//     if (company.approvedByAdmin) {
//         return next(new Error("✅ Company is already approved!", { cause: 400 }));
//     }

//     company.approvedByAdmin = true;
//     await company.save();

//     return successresponse(res, "✅ Company approved successfully!", 200, {
//         companyId: company._id,
//         approvedByAdmin: company.approvedByAdmin,
//     });
// });

