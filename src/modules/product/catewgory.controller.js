// import { Router } from "express";
// import { createCategory, createdepatment, createMostawdaa, createSocialMedia, deleteCategory, deletedepartment, deleteFcmToken, deleteMix, deleteMostawdaa, getAllProductsWithWarehouses, getCategories, getdepartment, getNotificationsByEmail, getSocialMedia, getUserNotifications, markAllAsRead, markNotificationAsRead, notifyall, savetoken, sendnotification, sendNotificationToUser, updateCategory, updatedepartment, updateMostawdaa, updateNotification, updateSocialMedia } from "./service/category.service.js";
// import { fileValidationTypes, uploadCloudFile } from "../../utlis/multer/cloud.multer.js";
// import { authentication, authorization } from "../../middlewere/authontcation.middlewere.js";
// import { endpoint } from "./category.authrize.js";
// const router = Router()


// router.post("/createCategory",
//     authentication(),
//     authorization(endpoint.create),
//     uploadCloudFile(fileValidationTypes.image).single("image"),
//    createCategory
// )
// router.post("/createMostawdaa",
//     authentication(),
//     authorization(endpoint.create),
//     uploadCloudFile(fileValidationTypes.image).single("image"),
//     createMostawdaa
// )
// router.post("/sendNotificationToUser",
//     authentication(),
//     authorization(endpoint.create),
//     uploadCloudFile(fileValidationTypes.image).single("image"),
//     sendNotificationToUser
// )
// router.post("/updateNotification",
//     authentication(),
//     authorization(endpoint.create),
//     uploadCloudFile(fileValidationTypes.image).single("image"),
//     updateNotification
// )

// router.patch("/updateCategory/:categoryId",
//     authentication(),
//     authorization(endpoint.update),
//     uploadCloudFile(fileValidationTypes.image).single("image"),
//     updateCategory
// )


// router.patch("/updateMostawdaa/:mostawdaaId",
//     authentication(),
//     authorization(endpoint.update),
//     uploadCloudFile(fileValidationTypes.image).single("image"),
//     updateMostawdaa
// )


// router.patch("/updatedepartment/:departmentId",
//     authentication(),
//     authorization(endpoint.update),
  
//     updatedepartment
// )
// router.delete("/deleteCategory/:categoryId",
//     authentication(),
//     authorization(endpoint.delete),
//     uploadCloudFile(fileValidationTypes.image).single("image"),
//     deleteCategory
// )

// router.post("/createdepatment",
//     authentication(),
//     authorization(endpoint.create),
//         createdepatment
// )

// router.delete("/deletedepartment/:departmentId",
//     authentication(),
//     authorization(endpoint.delete),
   
//     deletedepartment
// )


// router.delete("/deleteMostawdaa/:mostawdaaId",
//     authentication(),
//     authorization(endpoint.delete),

//     deleteMostawdaa
// )



// router.post("/getCategory", getCategories)
// router.delete("/deleteMix/:mixId", deleteMix)
// router.post("/updateSocialMedia", updateSocialMedia)
// router.post("/createSocialMedia", createSocialMedia)

// router.post("/savetoken", savetoken)
// router.post("/notifyall", notifyall)

// router.post("/markAllAsRead",authentication() ,markAllAsRead)
// router.post("/sendnotification", sendnotification)

// router.post("/markNotificationAsRead/:id", markNotificationAsRead)

// router.get("/getdepartment", getdepartment)
// router.delete("/deleteFcmToken", authentication(),deleteFcmToken)

// router.get("/getSocialMedia", getSocialMedia)

// router.get("/getUserNotifications", authentication(),getUserNotifications)
// router.get("/getAllProductsWithWarehouses", getAllProductsWithWarehouses)
// router.get("/getNotificationsByEmail", getNotificationsByEmail)


// export default router
