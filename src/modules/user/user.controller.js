import { Router } from "express";
import * as validators from "../user/user.validation.js"
import { validation } from "../../middlewere/validation.middlewere.js";
import { authentication, authorization } from "../../middlewere/authontcation.middlewere.js";
import { coverimages, Getloginuseraccount, updateimage, updatepassword, Updateuseraccount, Getprofiledata, deleteProfileImage, deleteCoverImage, adduser, getprofile, getAllUsers, getAllMessages, createMessage, addToFavorite, removeFromFavorite, getUserFavorites, savetoken, deleteFcmToken } from "./service/profile.service.js";
import { fileValidationTypes, uploadCloudFile } from "../../utlis/multer/cloud.multer.js";

const router = Router()




router.get("/Getloginuseraccount", authentication(), Getloginuseraccount)
router.post("/getAllUsers", getAllUsers)
router.get("/getAllMessages", getAllMessages)
router.post("/createMessage", createMessage)
router.post("/savetoken", savetoken)
router.post("/addToFavorite", authentication(), addToFavorite)
router.delete("/removeFromFavorite", authentication(), removeFromFavorite)

router.get("/getUserFavorites", authentication(), getUserFavorites)
router.delete("/deleteFcmToken", authentication(), deleteFcmToken)

router.patch("/Updateuseraccount", Updateuseraccount)
router.patch("/updatepassword", authentication(), updatepassword)
router.get("/Getprofiledata", authentication(), Getprofiledata)
router.post("/adduser/:friendId", authentication(), adduser)
router.get("/getprofile", authentication(), getprofile)
router.patch("/profile/coverimage", authentication(),
  
    uploadCloudFile(fileValidationTypes.image).array('image', 2),


    coverimages);


router.patch("/profile/image", authentication(),
   
    uploadCloudFile(fileValidationTypes.image).single('image')
    , updateimage);

router.delete("/deleteProfileImage", authentication(), deleteProfileImage)
router.delete("/deleteCoverImage", authentication(), deleteCoverImage)
export default router