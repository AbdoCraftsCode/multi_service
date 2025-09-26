import { Router } from "express";
import { authentication, authorization } from "../../middlewere/authontcation.middlewere.js";
import { fileValidationTypes, uploadCloudFile } from "../../utlis/multer/cloud.multer.js";
import { endpoint } from "./production.authrize.js";
import { cancelOrder, reorderHatap ,createAdminByOwner, updateMixPriceAndQuantity,createBranch, createImages, createMix, createOrder, createProduct, deleteAdminByOwner, deleteBranch, deleteImage, deleteProduct, deleteProductImage, getAllAdmins, getAllBranches, getAllImages, getAllMostawdaas, getAllOrders, getMostawdaasWithProducts, getorder, getProducts, getProductsByMostawdaa, getProductswithout, reorderProduct, searchUsersByName,  updateAdminByOwner, updateOrder, updateProduct, reorderProductInWarehouse, getAllProductsWithMostawdaNames, createHatap, gethatap, deleteHatap, updateHatap, getAdminNotifications, markAllAdminNotificationsAsRead, createCustomContent, getAllCustomContent } from "./service/production.service.js";

const router = Router()


router.post("/createProduct",
    authentication(),
    authorization(endpoint.create),
    uploadCloudFile(fileValidationTypes.image).fields([
        { name: "image", maxCount: 5 },
        { name: "logo", maxCount: 1 }
    ]),
    createProduct
);

router.post(
    "/createCustomContent",
    uploadCloudFile(fileValidationTypes.image).single("image"),
    createCustomContent
);
  

router.post("/createHatap",
    authentication(),
    authorization(endpoint.create),
    uploadCloudFile(fileValidationTypes.image).fields([
        { name: "image", maxCount: 5 },
        { name: "logo", maxCount: 1 }
    ]),
    createHatap
);


router.patch("/updateHatap/:productId",
    authentication(),
    authorization(endpoint.create),
    uploadCloudFile(fileValidationTypes.image).fields([
        { name: "image", maxCount: 5 },
        { name: "logo", maxCount: 1 }
    ]),
    updateHatap
);



router.post("/createImages/admin",
    authentication(),
    authorization(endpoint.create),
    uploadCloudFile(fileValidationTypes.image).array("image", 3),
    createImages
)

router.post("/getProducts", getProducts)
router.patch("/updateMixPriceAndQuantity/:id", updateMixPriceAndQuantity)
router.post("/reorderProduct", reorderProduct)

router.post("/reorderHatap", reorderHatap)

router.post("/reorderProductInWarehouse", reorderProductInWarehouse)
router.post("/createMix",authentication() ,createMix)
router.patch("/updateOrder/:orderId", authentication(),updateOrder)
router.get("/getAllImages", getAllImages)
router.post("/gethatap", gethatap)
router.get("/getMostawdaasWithProducts", getMostawdaasWithProducts)
router.get("/getorder", authentication(),getorder)
router.post("/getProductswithout", getProductswithout)
router.get("/getAllBranches/admin", getAllBranches)
router.get("/getAdminNotifications", getAdminNotifications)
router.get("/getAllCustomContent", getAllCustomContent)
router.get("/getAllAdmins/admin", getAllAdmins)
router.post("/getProductsByMostawdaa/:mostawdaaId", getProductsByMostawdaa)
router.post("/getAllOrders", getAllOrders)
router.post("/markAllAdminNotificationsAsRead", markAllAdminNotificationsAsRead)
router.get("/getAllProductsWithMostawdaNames", getAllProductsWithMostawdaNames)
router.get("/getAllMostawdaas", getAllMostawdaas)
router.get("/searchUsersByName/admin", searchUsersByName)
router.delete("/deleteAdminByOwner/:adminId/admin", authentication(), deleteAdminByOwner)
router.delete("/deleteBranch/:branchId/admin", authentication(),authorization(endpoint.delete) ,deleteBranch)
router.post("/createOrder", authentication(), createOrder)
router.post("/createAdminByOwner/admin", authentication(), createAdminByOwner)
router.post("/createBranch/admin", authentication(), authorization(endpoint.create),createBranch)
router.patch("/updateAdminByOwner/:adminId/admin", authentication(), updateAdminByOwner)
// router.post("/sendNotificationToUser/admin",
//     authentication(),
//     authorization(endpoint.create),
//     uploadCloudFile(fileValidationTypes.image).array("image", 3),
//     sendNotificationToUser)


router.patch("/updateProduct/:productId",
    authentication(),
    authorization(endpoint.update),
    uploadCloudFile(fileValidationTypes.image).fields([
        { name: "image", maxCount: 5 },
        { name: "logo", maxCount: 1 }
    ]),
    updateProduct
);


router.delete("/deleteHatap/:productId", authentication(), deleteHatap)

router.delete("/cancelOrder/:orderId", authentication(), cancelOrder)
router.delete("/deleteImage/admin", authentication(), deleteImage)

router.delete("/deleteProductImage", authentication(),authorization(endpoint.delete),deleteProductImage)
router.delete("/deleteProduct/:productId",authentication(),authorization(endpoint.delete),deleteProduct)



export default router



