// import { CompanyModel } from "../../../DB/models/Company.model.js";
// import { asyncHandelr } from "../../../utlis/response/error.response.js";
// import { successresponse } from "../../../utlis/response/success.response.js";
// import  * as dbservice from "../../../DB/dbservice.js"
// import cloud from "../../../utlis/multer/cloudinary.js";
// import mongoose from "mongoose";




// export const addCompany = asyncHandelr(async (req, res, next) => {
//     const { companyName, companyEmail, description, industry, address, numberOfEmployees, HRs } = req.body;


//     const existingCompany = await dbservice.findOne ({
//         model: CompanyModel,
//         filter: {
            
//             $or: [{ companyName }, { companyEmail }]
//         }
//     });

//     if (existingCompany) {
//         return next(new Error("Company name or email already exists", { cause: 400 }));
//     }

  
//     const newCompany = await dbservice.create({
//         model: CompanyModel,
//         data: {
//             createdBy: req.user._id, 
//             companyName,
//             companyEmail,
//             description,
//             industry,
//             address,
//             numberOfEmployees,
//             HRs,
//         }
       
    
//     });

//     return successresponse(res, "Company added successfully", 201, { company: newCompany });
// });



// export const uploadCompanyLogo = asyncHandelr(async (req, res, next) => {
//     const { companyId } = req.params;
//     const userId = req.user._id; 


//     const company = await CompanyModel.findById(companyId);
//     if (!company) {
//         return next(new Error("Company not found", { cause: 404 }));
//     }

//     if (company.createdBy.toString() !== userId.toString() && !company.HRs.includes(userId)) {
//         return next(new Error("Unauthorized: You are not allowed to update this company", { cause: 403 }));
//     }


//     const { secure_url, public_id } = await cloud.uploader.upload(req.file.path, {
//         folder: `company/${companyId}/logo`
//     });


//     if (company.logo?.public_id) {
//         await cloud.uploader.destroy(company.logo.public_id);
//     }

   
//     company.logo = { secure_url, public_id };
//     await company.save();

//     return successresponse(res, "Company logo updated successfully", 200, {
//         file: req.file,
//         company
//     });
// });




// export const deleteCompanyLogo = asyncHandelr(async (req, res, next) => {
//     const { companyId } = req.params;
//     const userId = req.user._id; 


//     const company = await CompanyModel.findById(companyId);
//     if (!company) {
//         return next(new Error("Company not found", { cause: 404 }));
//     }


//     if (company.createdBy.toString() !== userId.toString() && !company.HRs.includes(userId)) {
//         return next(new Error("Unauthorized: You are not allowed to delete this logo", { cause: 403 }));
//     }

 
//     if (!company.logo?.public_id) {
//         return next(new Error("No company logo found to delete", { cause: 404 }));
//     }


//     await cloud.uploader.destroy(company.logo.public_id);

 
//     company.logo = null;
//     await company.save();

//     return successresponse(res, "Company logo deleted successfully", 200, {
//         message: "Company logo removed",
//     });
// });


// export const UploadCompanyCoverPic = asyncHandelr(async (req, res, next) => {
//     const { companyId } = req.params;
//     const userId = req.user._id; 

   
//     const company = await CompanyModel.findById(companyId);
//     if (!company) {
//         return next(new Error("Company not found", { cause: 404 }));
//     }

   
//     if (company.createdBy.toString() !== userId.toString() && !company.HRs.includes(userId)) {
//         return next(new Error("Unauthorized: You are not allowed to update cover images", { cause: 403 }));
//     }

 
//     const images = [];
//     for (const file of req.files) {
//         const { secure_url, public_id } = await cloud.uploader.upload(file.path, { folder: `company/${companyId}/cover` });
//         images.push({ public_id, secure_url });
//     }

//     company.coverPic = images;
//     await company.save();

//     return successresponse(res, "Company cover images updated successfully", 200, {
//         files: req.files,
//         company
//     });
// });


// export const DeleteCompanyCoverPic = asyncHandelr(async (req, res, next) => {
//     const { companyId } = req.params; 
//     const { public_id } = req.body;
//     const userId = req.user._id;

//     const company = await CompanyModel.findById(companyId);
//     if (!company) {
//         return next(new Error("Company not found", { cause: 404 }));
//     }

 
//     if (company.createdBy.toString() !== userId.toString() && !company.HRs.includes(userId)) {
//         return next(new Error("Unauthorized: You are not allowed to delete cover images", { cause: 403 }));
//     }

//     const imageIndex = company.coverPic.findIndex(img => img.public_id === public_id);
//     if (imageIndex === -1) {
//         return next(new Error("Image not found in company's cover pictures", { cause: 404 }));
//     }

  
//     await cloud.uploader.destroy(public_id);


//     company.coverPic.splice(imageIndex, 1);
//     await company.save();

//     return successresponse(res, "Cover image deleted successfully", 200, {
//         company
//     });
// });


// export const uploadLegalAttachment = asyncHandelr(async (req, res, next) => {
//     const companyId = req.params.companyId.trim(); 


  
//     const company = await CompanyModel.findById(companyId);
//     if (!company) {
//         return next(new Error("Company not found", { cause: 404 }));
//     }

//     if (!req.files || req.files.length === 0) {
//         return next(new Error("No files uploaded", { cause: 400 }));
//     }

//     const files = [];
//     for (const file of req.files) {
//         const { secure_url, public_id, format } = await cloud.uploader.upload(file.path, {
//             folder: `company/${companyId}/documents`,
//             resource_type: "auto"
//         });
//         files.push({ public_id, secure_url, format });
//     }

//     console.log("📌 Uploaded files:", files);

//     company.legalAttachments.push(...files); 
//     await company.save();

//     console.log("📌 Updated company:", company);

//     return successresponse(res, "Legal attachments uploaded successfully", 200, { company });
// });




// export const searchCompanyByName = asyncHandelr(async (req, res, next) => {
//     const name = req.query.name?.trim(); 

//     if (!name) {
//         return next(new Error("Company name is required for search", { cause: 400 }));
//     }

//     const companies = await CompanyModel.find({
//         companyName: { $regex: new RegExp(name, "i") } 
//     });

//     if (!companies.length) {
//         return successresponse(res, "No companies found", 200, { companies: [] });
//     }

//     return successresponse(res, "Companies found", 200, { companies });
// });






// export const updateCompany = asyncHandelr(async (req, res, next) => {
//     const { companyId } = req.params;
//     const userId = req.user._id;
//     const updateData = req.body;



  
//     if ("legalAttachments" in updateData) {
//         return next(new Error("You cannot update legal attachments", { cause: 403 }));
//     }


//     const company = await CompanyModel.findById(companyId);
//     if (!company) {
//         return next(new Error("Company not found", { cause: 404 }));
//     }


//     if (company.createdBy.toString() !== userId.toString()) {
//         return next(new Error("Unauthorized: Only the company owner can update the data", { cause: 403 }));
//     }


//     const updatedCompany = await CompanyModel.findByIdAndUpdate(companyId, updateData, { new: true });

//     return successresponse(res, "Company updated successfully", 200, { company: updatedCompany });
// });















// export const softDeleteCompany = asyncHandelr(async (req, res, next) => {
//     const companyId = req.params.companyId.trim(); // إزالة أي مسافات أو أسطر جديدة
//     const userId = req.user._id;
//     const userRole = req.user.role;

    
//     if (!mongoose.Types.ObjectId.isValid(companyId)) {
//         return next(new Error("Invalid Company ID", { cause: 400 }));
//     }

//     const company = await CompanyModel.findById(companyId);
//     if (!company) {
//         return next(new Error("Company not found", { cause: 404 }));
//     }

//     if (company.createdBy.toString() !== userId.toString() && userRole !== "Admin") {
//         return next(new Error("Unauthorized: Only the company owner or an admin can delete this company", { cause: 403 }));
//     }

//     company.isDeleted = true;
//     await company.save();

//     return successresponse(res, "Company soft deleted successfully", 200, { company });
// });




// export const restoreCompany = asyncHandelr(async (req, res, next) => {
//     const companyId = req.params.companyId.trim();

//     if (!mongoose.Types.ObjectId.isValid(companyId)) {
//         return next(new Error("Invalid Company ID", { cause: 400 }));
//     }

//     const company = await CompanyModel.findById(companyId);
//     if (!company) {
//         return next(new Error("Company not found", { cause: 404 }));
//     }

//     if (company.createdBy.toString() !== req.user._id.toString() && req.user.role !== "Admin") {
//         return next(new Error("Unauthorized: Only the company owner or an admin can restore this company", { cause: 403 }));
//     }

//     if (!company.isDeleted) {
//         return next(new Error("Company is already active", { cause: 400 }));
//     }

//     company.isDeleted = false; // ✅ إعادة الشركة
//     await company.save();

//     return successresponse(res, "Company restored successfully", 200, { company });
// });











