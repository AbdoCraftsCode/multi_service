// import { Router } from "express";
// import { addCompany, DeleteCompanyCoverPic, updateCompany, restoreCompany,deleteCompanyLogo, softDeleteCompany,UploadCompanyCoverPic, uploadLegalAttachment ,uploadCompanyLogo, searchCompanyByName } from "./sevice/company.servic.js";
// import { authentication } from "../../middlewere/authontcation.middlewere.js";
// import { fileValidationTypes, uploadCloudFile } from "../../utlis/multer/cloud.multer.js";
// const router = Router()


// router.post("/addCompany", authentication(), addCompany)
// router.get("/search",  searchCompanyByName)
// router.patch("/updateCompany/:companyId",authentication() ,updateCompany)
// router.patch("/restoreCompany/:companyId", authentication(), restoreCompany)
// router.delete("/softDeleteCompany/:companyId", authentication(), softDeleteCompany)

// router.patch("/company/logo/:companyId", authentication(),

//     uploadCloudFile(fileValidationTypes.image).single('image')
//     , uploadCompanyLogo);


// router.delete("/deleteCompanyLogo/:companyId", authentication(), deleteCompanyLogo)


// router.patch("/company/cover/:companyId", authentication(),

//     uploadCloudFile(fileValidationTypes.image).array('image' ,2)
//     , UploadCompanyCoverPic);

// router.delete("/DeleteCompanyCoverPic/:companyId", authentication(), DeleteCompanyCoverPic)

// // router.patch("/company/legalAttachment/:companyId",
// //     authentication(),
// //     uploadCloudFile(fileValidationTypes.document).array('document', 1),

// //     uploadLegalAttachment
// // );

// router.patch("/uploadLegalAttachment/:companyId",
//     authentication(),
//     uploadCloudFile(fileValidationTypes.document).array('document', 1),
//     uploadLegalAttachment
// )

// export default router