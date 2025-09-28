import { Router } from "express";
import { validation } from "../../middlewere/validation.middlewere.js";
import  * as validators from "../auth/auth.validate.js"
import { addAuthorizedUser, addAuthorizedUserToSupermarket, addProduct, addSection, confirmOTP, createAdminUser, createAppointment, createBranch, createDoctor, createEvaluation, createMainGroup, createMode, createOrder, createOrderSupermarket, createPermissions, createProduct, createPropertyBooking, createQuestion, createRentalProperty, createRestaurant, createService, createSubGroup, createSupermarket, deleteAdminUser, deleteBranch, deleteDoctor, deleteMainGroup, deletePermission, deleteRentalProperty, deleteSingleQuestion, deleteSubGroup, findNearbyDrivers, getAcceptedOrders, getAccessibleSupermarket, getAllAdminUsers, getAllNormalUsers, getAllPermissions, getAllRentalProperties, getAllServiceProviders, getBranches, getDoctorAppointments, getDoctors, getDriverHistory, getEvaluations, getMainGroupsForUser, getMainGroupsWithSubGroups, getManagerRestaurants, getMyDoctorProfile, getMyEvaluations, getMyRestaurantsProducts, getMySubGroups, getNotificationsByDoctor, getNotificationsByProperty, getNotificationsByRestaurant, getOwnerRestaurants, getProductsByRestaurant, getPropertyBookings, getQuestionsByMainGroups, getRestaurantOrders, getRestaurants, getServices, getSubGroupsByMainGroup, getSupermarket, getSupermarketAdmin, getSupermarketNotifications, getSupermarketOrders, getSupermarketSections, getSupermarketWithSectionsAndProducts, getUserRentalProperties, markAllNotificationsAsRead, markAllNotificationsAsReadDoctor, markAllNotificationsAsReadProperty, registerRestaurant, sendotpphone, signup, signupServiceProvider, signupwithGmail, updateAdminUser, updateBranch, updateDoctor, updateMainGroup, updateOrderStatus, updateOrderStatusSupermarket, updatePermission, updateRentalProperty, updateService, updateSingleQuestion, updateSubGroup, updateUser,  } from "./service/regestration.service.js";
import { confirEachOtp, deleteMyAccount, forgetpassword,   forgetPasswordphone,   forgetPasswordphoneadmin,   getMyProfile,   login, loginAdmin, loginRestaurant, loginwithGmail, refreshToken, resendOTP, resetpassword, resetPasswordphone, verifyOTP } from "./service/authontecation.service.js";
import { authentication, checkRestaurantPermission } from "../../middlewere/authontcation.middlewere.js";

const routr = Router()



import axios from "axios";
import dotenv from "dotenv";
import { fileValidationTypes, uploadCloudFile } from "../../utlis/multer/cloud.multer.js";

dotenv.config();

routr.post(
    "/createDoctor",
    authentication(),
    uploadCloudFile([
        ...fileValidationTypes.image,
        ...fileValidationTypes.document
    ]).fields([
        { name: "profileImage", maxCount: 1 },
        { name: "certificates", maxCount: 10 }
    ]),
    createDoctor
);


routr.patch(
    "/updateDoctor/:id",
    authentication(),
    uploadCloudFile([
        ...fileValidationTypes.image,
        ...fileValidationTypes.document
    ]).fields([
        { name: "profileImage", maxCount: 1 },
        { name: "certificates", maxCount: 10 }
    ]),
    updateDoctor
);



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

routr.post(
    "/createRentalProperty",
    authentication(), // تحقق من التوكن
    uploadCloudFile([
        ...fileValidationTypes.image,
        ...fileValidationTypes.document
    ]).fields([
        { name: "images", maxCount: 10 } // صور العقار
    ]),
    createRentalProperty
);

routr.post(
    "/createRestaurant",
    authentication(), // تحقق من التوكن
    uploadCloudFile([
        ...fileValidationTypes.image,
        ...fileValidationTypes.document
    ]).fields([
        { name: "image", maxCount: 10 },
        { name: "menuImages", maxCount: 10 } // صور العقار
    ]),
    createRestaurant
);

routr.post(
    "/createSupermarket",
    authentication(),
    uploadCloudFile([
        ...fileValidationTypes.image,
        ...fileValidationTypes.document
    ]).fields([
        { name: "image", maxCount: 1 },          // cover image
        { name: "bannerImages", maxCount: 10 }   // banners
    ]),
    createSupermarket
);


routr.post(
    "/addProduct/:sectionId",
    authentication(),
    uploadCloudFile([
        ...fileValidationTypes.image
    ]).fields([
        { name: "images", maxCount: 10 }
    ]),
    addProduct
);

routr.post(
    "/createProduct",
    authentication(),
    uploadCloudFile([
        ...fileValidationTypes.image,
        ...fileValidationTypes.document
    ]).fields([
        { name: "images", maxCount: 10 }
    ]),
    checkRestaurantPermission(["manager"]),
    createProduct
);




routr.post("/signup", signup)

routr.get("/getSupermarket", getSupermarket)
routr.get("/getSupermarketSections/:id", getSupermarketSections)
routr.post("/addSection/:supermarketId",authentication(), addSection)
routr.post("/createOrder",authentication() ,createOrder)
routr.post("/loginAdmin", loginAdmin)
routr.post("/markAllNotificationsAsReadDoctor/:doctorId", markAllNotificationsAsReadDoctor)
routr.post("/createAppointment", authentication(),createAppointment)

routr.get("/getRestaurants", getRestaurants)
routr.patch("/updateUser/:id", updateUser)
routr.get("/findNearbyDrivers", findNearbyDrivers)
routr.get("/getDriverHistory/:driverId", getDriverHistory)
routr.get("/getNotificationsByDoctor/:doctorId", getNotificationsByDoctor)
routr.get("/getDoctorAppointments/:doctorId", getDoctorAppointments)
routr.get("/getManagerRestaurants", authentication(),getManagerRestaurants)
routr.get("/getOwnerRestaurants", authentication(), getOwnerRestaurants)
routr.get("/getMyRestaurantsProducts/:restaurantId", authentication(), getMyRestaurantsProducts)
routr.get("/getProductsByRestaurant/:restaurantId", getProductsByRestaurant)
routr.get("/getUserRentalProperties", authentication(), getUserRentalProperties)

routr.get("/getRestaurantOrders/:restaurantId", getRestaurantOrders)
routr.patch("/updateOrderStatusSupermarket/:orderId", uploadCloudFile([
    ...fileValidationTypes.image,
    ...fileValidationTypes.document
]).fields([
    { name: "image", maxCount: 10 } // صور العقار
]), updateOrderStatusSupermarket)

routr.post(
    "/createService",
    uploadCloudFile(fileValidationTypes.image).fields([{ name: "servicePicture", maxCount: 1 }]),
    createService
);

routr.patch(
    "/updateService/:id",
    uploadCloudFile(fileValidationTypes.image).fields([{ name: "servicePicture", maxCount: 1 }]),
    updateService
);
routr.post("/addAuthorizedUser", authentication(), addAuthorizedUser)
routr.get("/getAcceptedOrders", getAcceptedOrders)
routr.get("/getServices", getServices)
routr.get("/getSupermarketOrders/:supermarketId", getSupermarketOrders)
routr.get("/getSupermarketNotifications/:supermarketId", getSupermarketNotifications)
routr.post("/createOrderSupermarket", authentication(), createOrderSupermarket)
routr.get("/getMyProfile", authentication(), getMyProfile)
routr.get("/getAccessibleSupermarket", authentication(), getAccessibleSupermarket)

routr.get("/getSupermarketWithSectionsAndProducts/:supermarketId", authentication(), getSupermarketWithSectionsAndProducts)

routr.post("/addAuthorizedUserToSupermarket", authentication(), addAuthorizedUserToSupermarket)
routr.get("/getMyDoctorProfile", authentication(), getMyDoctorProfile)
routr.delete("/deleteDoctor/:id", authentication(), deleteDoctor)
routr.post("/registerRestaurant", registerRestaurant)
routr.post("/verifyOTP", verifyOTP)
routr.patch("/updateRentalProperty/:id", authentication(),
    uploadCloudFile([
        ...fileValidationTypes.image,
        ...fileValidationTypes.document
    ]).fields([
        { name: "images", maxCount: 10 } // صور العقار
    ]),
    updateRentalProperty)
routr.post("/confirEachOtp", confirEachOtp)

routr.post("/login", login)

routr.get("/getDoctors", getDoctors)
routr.get("/getAllRentalProperties", getAllRentalProperties)
routr.post("/createBranch", authentication(), createBranch)
routr.delete("/deleteRentalProperty/:id", authentication(), deleteRentalProperty)
routr.post("/loginRestaurant", loginRestaurant)
routr.post("/resendOTP",resendOTP )
routr.post("/resetpassword", resetpassword) 
routr.patch("/resetPasswordphone", resetPasswordphone)
routr.post("/signupwithGmail", signupwithGmail)
// routr.post("/confirmOTP", confirmOTP)
routr.post("/sendotpphone", sendotpphone)
routr.post("/confirmOTP", confirmOTP)

routr.get("/getNotificationsByRestaurant/:restaurantId", getNotificationsByRestaurant)

routr.patch(
    "/updateOrderStatus/:orderId",
    uploadCloudFile([
        ...fileValidationTypes.image,
        ...fileValidationTypes.document
    ]).fields([
        { name: "image", maxCount: 10 } // صور الفاتورة
    ]),
    updateOrderStatus
);

routr.get("/getAllNormalUsers", getAllNormalUsers)
routr.get("/getSupermarketAdmin", getSupermarketAdmin)
routr.get("/getPropertyBookings/:propertyId", getPropertyBookings)
routr.get("/getNotificationsByProperty/:propertyId", getNotificationsByProperty)
routr.patch("/markAllNotificationsAsReadProperty/:propertyId", markAllNotificationsAsReadProperty)
routr.get("/getAllServiceProviders", getAllServiceProviders)

routr.post("/getBranches", authentication(), getBranches)
routr.post("/createPropertyBooking", authentication(), createPropertyBooking)

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
routr.get("/getAllPermissions", getAllPermissions)
routr.post("/markAllNotificationsAsRead/:restaurantId", markAllNotificationsAsRead)

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