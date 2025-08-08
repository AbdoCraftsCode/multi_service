import { Router } from "express";
import { validation } from "../../middlewere/validation.middlewere.js";
import  * as validators from "../auth/auth.validate.js"
import { confirmOTP, createAdminUser, createBranch, createEvaluation, createMainGroup, createMode, createPermissions, createQuestion, createSubGroup, deleteAdminUser, deleteBranch, deleteMainGroup, deletePermission, deleteSingleQuestion, deleteSubGroup, getAllAdminUsers, getAllPermissions, getBranches, getEvaluations, getMainGroupsForUser, getMainGroupsWithSubGroups, getMyEvaluations, getMySubGroups, getQuestionsByMainGroups, getSubGroupsByMainGroup, registerRestaurant, sendotpphone, signup, signupServiceProvider, signupwithGmail, updateAdminUser, updateBranch, updateMainGroup, updatePermission, updateSingleQuestion, updateSubGroup,  } from "./service/regestration.service.js";
import { confirEachOtp, deleteMyAccount, forgetpassword,   forgetPasswordphone,   forgetPasswordphoneadmin,   login, loginRestaurant, loginwithGmail, refreshToken, resendOTP, resetpassword, resetPasswordphone, verifyOTP } from "./service/authontecation.service.js";
import { authentication } from "../../middlewere/authontcation.middlewere.js";

const routr = Router()



import axios from "axios";
import dotenv from "dotenv";
import { fileValidationTypes, uploadCloudFile } from "../../utlis/multer/cloud.multer.js";

dotenv.config();



routr.post(
    "/signupServiceProvider",
    uploadCloudFile([
        ...fileValidationTypes.image,
        ...fileValidationTypes.document
    ]).fields([
        { name: "nationalIdImage", maxCount: 1 },
        { name: "driverLicenseImage", maxCount: 1 },
        { name: "profiePicture", maxCount: 1 },
        { name: "carLicenseImage", maxCount: 1 },
        { name: "carImages", maxCount: 10 },
        { name: "additionalDocuments", maxCount: 1 }
    ]),
    signupServiceProvider
);



routr.post("/signup", signup)
routr.post("/registerRestaurant", registerRestaurant)
routr.post("/verifyOTP", verifyOTP)
routr.post("/confirEachOtp", confirEachOtp)
routr.post("/login", login)
routr.post("/createBranch", authentication(),createBranch)
routr.post("/loginRestaurant", loginRestaurant)
routr.post("/resendOTP",resendOTP )
routr.post("/resetpassword", resetpassword)
routr.patch("/resetPasswordphone", resetPasswordphone)
routr.post("/signupwithGmail", signupwithGmail)
// routr.post("/confirmOTP", confirmOTP)
routr.post("/sendotpphone", sendotpphone)
routr.post("/confirmOTP", confirmOTP)
routr.post("/getBranches", authentication(), getBranches)
routr.get("/getMainGroupsForUser", authentication(), getMainGroupsForUser)

routr.get("/getMainGroupsWithSubGroups", authentication(), getMainGroupsWithSubGroups)

routr.delete("/deleteBranch/:id", authentication(), deleteBranch)
routr.delete("/deleteAdminUser/:id", authentication(), deleteAdminUser)

routr.put("/updateBranch/:id", authentication(), updateBranch)
routr.post("/refreshToken", refreshToken)
routr.post("/createMainGroup", authentication(), createMainGroup)
routr.post("/createSubGroup", authentication(), createSubGroup)
routr.post("/forgetpassword", forgetpassword)
routr.post("/forgetpasswordphone", forgetPasswordphone)
routr.post("/forgetPasswordphoneadmin", forgetPasswordphoneadmin)
routr.post("/loginwithGmail", loginwithGmail)
routr.delete("/deleteMyAccount", authentication(), deleteMyAccount)
routr.delete("/deleteMainGroup/:id", authentication(), deleteMainGroup)
routr.delete("/deletePermission/:id", authentication(), deletePermission)
routr.patch("/updatePermission/:id", authentication(), updatePermission)
routr.delete("/deleteSubGroup/:id", authentication(), deleteSubGroup)
routr.patch("/updateMainGroup/:id", authentication(), updateMainGroup)
routr.patch("/updateSubGroup/:id", authentication(), updateSubGroup)
routr.post("/createEvaluation", authentication(), createEvaluation)

routr.post("/createPermissions", createPermissions)
routr.post("/createMode",authentication(), createMode)
routr.post("/createQuestion", authentication(), createQuestion)
routr.post("/getMyEvaluations", authentication(), getMyEvaluations)
routr.get("/getMySubGroups", authentication(), getMySubGroups)
routr.delete("/deleteSingleQuestion/:mainId/:questionId", deleteSingleQuestion)
routr.patch("/updateSingleQuestion/:mainId/:questionId", updateSingleQuestion)
routr.get("/getEvaluations", authentication(), getEvaluations)
routr.get("/getQuestionsByMainGroups", authentication(), getQuestionsByMainGroups)
routr.get("/getAllPermissions",  getAllPermissions)
routr.get("/getSubGroupsByMainGroup/:mainGroupId", authentication(), getSubGroupsByMainGroup)

routr.post("/createAdminUser",
    authentication(),
    uploadCloudFile(fileValidationTypes.image).fields([
        { name: "image", maxCount: 1 } // ✅ صورة واحدة فقط
    ]),
    createAdminUser
);


routr.patch("/updateAdminUser/:id",
    authentication(),
    uploadCloudFile(fileValidationTypes.image).fields([
        { name: "image", maxCount: 1 } // ✅ صورة واحدة فقط
    ]),
    updateAdminUser
);


routr.get("/getAllAdminUsers", authentication(), getAllAdminUsers)
export default routr