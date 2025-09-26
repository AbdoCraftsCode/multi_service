// import { CompanyModel } from "../../../DB/models/Company.model.js";
// import { asyncHandelr } from "../../../utlis/response/error.response.js";
// import mongoose from "mongoose";
// import { successresponse } from "../../../utlis/response/success.response.js";
// import { JobOpportunityModel } from "../../../DB/models/JobOpportunity.model.js";
// import { ApplicationModel } from "../../../DB/models/Application.model.js";
// import cloud from "../../../utlis/multer/cloudinary.js";
// import Usermodel, { scketConnections } from "../../../DB/models/User.model.js";
// import { getIo } from "../../chat/chat.socket.controller.js";
// import { Emailevent } from "../../../utlis/events/email.emit.js";

// import ExcelJS from "exceljs";
// import fs from "fs";
// import path from "path";
 

// export const addJobOpportunity = asyncHandelr(async (req, res, next) => {
//     const { jobTitle, jobLocation, workingTime, seniorityLevel, jobDescription, technicalSkills, softSkills } = req.body;
//     let { companyId } = req.params;

  

  
//     companyId = companyId.trim();

 
//     if (!mongoose.Types.ObjectId.isValid(companyId)) {
//         return next(new Error("❌ Invalid Company ID", { cause: 400 }));
//     }

//     const company = await CompanyModel.findById(companyId);
//     if (!company) {
//         return next(new Error("❌ Company not found", { cause: 404 }));
//     }

//     console.log("🏢 Company Found:", company.name); 

  
//     const isCompanyOwner = company.createdBy.toString() === req.user._id.toString();
//     const isHR = company.HRs.some(hrId => hrId.toString() === req.user._id.toString());

//     console.log("🔑 Is Owner?", isCompanyOwner);
//     console.log("🔑 Is HR?", isHR);

//     if (!isCompanyOwner && !isHR) {
//         return next(new Error("❌ Unauthorized: Only the company owner or an HR can add a job", { cause: 403 }));
//     }


//     const newJob = await JobOpportunityModel.create({
//         jobTitle,
//         jobLocation,
//         workingTime,
//         seniorityLevel,
//         jobDescription,
//         technicalSkills,
//         softSkills,
//         addedBy: req.user._id,
//         companyId
//     });

//     console.log("✅ Job Created:", newJob._id);

//     return successresponse(res, "✅ Job opportunity added successfully", 201, { job: newJob });
// });


// export const updateJobOpportunity = asyncHandelr(async (req, res, next) => {
//     let { jobId } = req.params;
//     const updates = req.body;
//     const userId = req.user._id;


//     jobId = jobId.trim(); 
 

   
//     if (!mongoose.isValidObjectId(jobId)) {
//         return next(new Error("❌ Invalid Job ID format", { cause: 400 }));
//     }


//     const job = await JobOpportunityModel.findById(jobId);
//     if (!job) {
//         return next(new Error("❌ Job not found", { cause: 404 }));
//     }




//     if (job.addedBy.toString() !== userId.toString()) {
//         return next(new Error("❌ Unauthorized: Only the job owner can update this job", { cause: 403 }));
//     }

//     Object.assign(job, updates);
//     job.updatedBy = userId; 
//     await job.save();

//     console.log("✅ Job Updated:", job._id);

//     return successresponse(res, "✅ Job opportunity updated successfully", 200, { job });
// });


// export const deleteJobOpportunity = asyncHandelr(async (req, res, next) => {
//     let { jobId } = req.params;
//     const userId = req.user._id;

//     console.log("🔹 Raw Job ID:", req.params.jobId);
//     jobId = jobId.trim(); 
//     console.log("🔹 Trimmed Job ID:", jobId);
//     console.log("👤 User ID:", userId);


//     if (!mongoose.isValidObjectId(jobId)) {
//         return next(new Error("❌ Invalid Job ID format", { cause: 400 }));
//     }


//     const job = await JobOpportunityModel.findById(jobId);
//     if (!job) {
//         return next(new Error("❌ Job not found", { cause: 404 }));
//     }

//     console.log("🏢 Job Found:", job.jobTitle);

//     const company = await CompanyModel.findById(job.companyId);
//     if (!company) {
//         return next(new Error("❌ Company not found", { cause: 404 }));
//     }

//     console.log("🏢 Company Found:", company.name);

//     const isHR = company.HRs.some(hrId => hrId.toString() === userId.toString());

//     if (!isHR) {
//         return next(new Error("❌ Unauthorized: Only company HRs can delete this job", { cause: 403 }));
//     }


//     await JobOpportunityModel.findByIdAndDelete(jobId);

//     console.log("✅ Job Deleted:", jobId);

//     return successresponse(res, "✅ Job opportunity deleted successfully", 200);
// });





// export const getAllJobs = asyncHandelr(async (req, res, next) => {
//     const { companyId } = req.params;
//     let { page = 1, limit = 10, sort = "createdAt", order = "desc", search } = req.query;

//     page = Math.max(1, parseInt(page));
//     limit = Math.max(1, parseInt(limit));

//     const filter = {};


//     if (search) {
//         const company = await CompanyModel.findOne({
//             companyName: { $regex: new RegExp(search.trim(), "i") }
//         }).select("_id");

//         if (!company) {
//             return next(new Error("❌ Company not found", { cause: 404 }));
//         }

//         filter.companyId = company._id;
//     }

//     if (companyId) {
//         filter.companyId = companyId;
//     }

//     const [jobs, totalCount] = await Promise.all([
//         JobOpportunityModel.find(filter)
//             .sort({ [sort]: order === "desc" ? -1 : 1 })
//             .skip((page - 1) * limit)
//             .limit(limit)
//             .lean(),

//         JobOpportunityModel.countDocuments(filter)
//     ]);

//     return successresponse(res, "✅ Jobs fetched successfully", 200, {
//         jobs,
//         totalCount,
//         totalPages: Math.ceil(totalCount / limit),
//         currentPage: page,
//     });
// });

// export const getAmanyJobs = asyncHandelr(async (req, res, next) => {
//     let { page = 1, limit = 10, sort = "createdAt", order = "desc", workingTime, jobLocation, seniorityLevel, jobTitle, technicalSkills } = req.query;

 
//     page = Math.max(1, parseInt(page));
//     limit = Math.max(1, parseInt(limit));

//     const filter = {};

   
//     if (workingTime) filter.workingTime = workingTime;
//     if (jobLocation) filter.jobLocation = jobLocation;
//     if (seniorityLevel) filter.seniorityLevel = seniorityLevel;
//     if (jobTitle) filter.jobTitle = { $regex: new RegExp(jobTitle, "i") }; 
//     if (technicalSkills) {
//         const skillsArray = technicalSkills.split(",").map(skill => skill.trim());
//         filter.technicalSkills = { $all: skillsArray }; 
//     }

  
//     const [jobs, totalCount] = await Promise.all([
//         JobOpportunityModel.find(filter)
//             .sort({ [sort]: order === "desc" ? -1 : 1 })
//             .skip((page - 1) * limit)
//             .limit(limit)
//             .lean(),

//         JobOpportunityModel.countDocuments(filter)
//     ]);


//     return successresponse(res, "✅ Jobs fetched successfully", 200, {
//         jobs,
//         totalCount,
//         totalPages: Math.ceil(totalCount / limit),
//         currentPage: page,
//     });
// });





// export const applyForJob = asyncHandelr(async (req, res, next) => {
//     console.log("🔹 req.body:", req.body);
//     console.log("🔹 req.user:", req.user);

//     const userId = req.user._id;
//     const { jobId } = req.body;

//     if (!jobId) {
//         return next(new Error("❌ jobId is required!", { cause: 400 }));
//     }


//     const job = await JobOpportunityModel.findById(jobId).populate("companyId");

//     if (!job || !job.companyId) {
//         return next(new Error("❌ Job not found or not linked to any company!", { cause: 404 }));
//     }

//     const company = await CompanyModel.findById(job.companyId._id).populate("HRs");

//     if (!company || !company.HRs || company.HRs.length === 0) {
//         return next(new Error("❌ No HRs found for this company!", { cause: 404 }));
//     }

//     let application = await ApplicationModel.findOne({ userId, jobId });

//     if (application) {
//         return next(new Error("❌ You have already applied for this job!", { cause: 400 }));
//     }

//     application = await ApplicationModel.create({
//         userId,
//         jobId,
//     });

//     company.HRs.forEach(hr => {
//         const hrSocketId = scketConnections.get(hr._id.toString()); 
//         if (hrSocketId) {
//             getIo().to(hrSocketId).emit("newJobApplication", {
//                 message: "📩 New job application received!",
//                 jobId,
//                 applicantId: userId
//             });
//         }
//     });

//     return successresponse(res, "✅ Job application submitted!", 201, { applicationId: application._id });
// });





// export const uploadUserCV = asyncHandelr(async (req, res, next) => {
//     console.log("🔹 req.file:", req.file);
//     console.log("🔹 req.params:", req.params);

//     const userId = req.user._id;
//     const { applicationId } = req.params;

//     if (!req.file) {
//         return next(new Error("❌ CV file is required!", { cause: 400 }));
//     }

//     const application = await ApplicationModel.findOne({ _id: applicationId, userId });

//     if (!application) {
//         return next(new Error("❌ Application not found!", { cause: 404 }));
//     }

//     if (application.userCV?.public_id) {
//         await cloud.uploader.destroy(application.userCV.public_id);
//     }


//     const uploadResult = await cloud.uploader.upload(req.file.path, {
//         folder: "user_CVs",
//         resource_type: "auto",
//     });

//     application.userCV = {
//         secure_url: uploadResult.secure_url,
//         public_id: uploadResult.public_id,
//     };

//     await application.save();

//     return successresponse(res, "✅ CV uploaded successfully!", 201, { application });
// });





// export const getApplicationsForJob = asyncHandelr(async (req, res, next) => {
    

//     const { jobId } = req.params;
//     const { page = 1, limit = 10, sort = "-createdAt" } = req.query;
//     const skip = (page - 1) * limit;

//     const user = req.user;

//     const job = await JobOpportunityModel.findOne({ _id: jobId }).populate({
//         path: "companyId",
//         select: " HRs", 
//     });

//     if (!job) {
//         return next(new Error("❌ Job not found!", { cause: 404 }));
//     }

    
//     const isOwner = user.role === "Admin" && user._id.toString() === job.companyId.owner.toString();
//     const isHR = job.companyId.HRs.some((hrId) => hrId.toString() === user._id.toString());

//     if (!isOwner && !isHR) {
//         return next(new Error("❌ Access denied! Only HRs from the same company or the Owner can view applications.", { cause: 403 }));
//     }

 
//     const applications = await ApplicationModel.find({ jobId })
//         .populate("userId", "firstName lastName email gender mobileNumber role") 
//         .skip(skip)
//         .limit(parseInt(limit))
//         .sort(sort);

//     const totalApplications = await ApplicationModel.countDocuments({ jobId });


//     return successresponse(res, "✅ Applications retrieved successfully!", 200, {
     
//         applications,
        
//     });
// });




// export const updateApplicationStatus = asyncHandelr(async (req, res, next) => {
//     const applicationId = req.body.applicationId?.trim();
//     const status = req.body.status?.trim();
//     const userId = req.user._id;

//     console.log("Request Body:", req.body);
//     console.log("Extracted Application ID:", applicationId);
//     console.log("Is Valid ObjectId:", mongoose.Types.ObjectId.isValid(applicationId));

//     if (!applicationId || !mongoose.Types.ObjectId.isValid(applicationId)) {
//         return next(new Error("❌ Invalid application ID!", { cause: 400 }));
//     }

//     const application = await ApplicationModel.findOne({ _id: applicationId }).populate("userId jobId");
//     if (!application) {
//         return next(new Error("❌ Application not found!", { cause: 404 }));
//     }

//     const job = await JobOpportunityModel.findById(application.jobId).populate("companyId");
//     if (!job || !job.companyId) {
//         return next(new Error("❌ Company not found for this job!", { cause: 404 }));
//     }

//     const company = await CompanyModel.findById(job.companyId).populate("HRs createdBy");
//     const isHR = company.HRs.some(hr => hr._id.toString() === userId.toString());
//     const isOwner = company.createdBy._id.toString() === userId.toString();

//     if (!isHR && !isOwner) {
//         return next(new Error("🚫 Unauthorized! Only HR or company owner can update applications.", { cause: 403 }));
//     }

//     application.status = status;
//     await application.save();


//     const emailData = {
//         email: application.userId.email,  
//         jobTitle: job.jobTitle,
//         companyName: company.companyName,
//     };

//     if (status === "accepted") {
//         Emailevent.emit("jobAccepted", emailData);
//     } else {
//         Emailevent.emit("jobRejected", emailData);
//     }

  
//     const userSocketId = scketConnections.get(application.userId._id.toString());
//     if (userSocketId) {
//         getIo().to(userSocketId).emit("applicationStatusUpdated", {
//             status,
//             jobTitle: job.jobTitle,
//             companyName: company.companyName,
//         });
//     }

//     return successresponse(res, `✅ Application ${status} successfully!`);
// });






// export const exportApplicationsToExcel = asyncHandelr(async (req, res, next) => {
//     let { companyId, date } = req.query;

//     if (!companyId) {
//         return next(new Error("❌ companyId is required!", { cause: 400 }));
//     }

//     if (!date) {
//         date = new Date().toISOString().split("T")[0]; 
//     }

//     console.log("Received companyId:", companyId);
//     console.log("Using date:", date);

//     const startOfDay = new Date(date);
//     startOfDay.setUTCHours(0, 0, 0, 0); 

//     const endOfDay = new Date(date);
//     endOfDay.setUTCHours(23, 59, 59, 999); 

//     console.log("Start of day:", startOfDay);
//     console.log("End of day:", endOfDay);

//     const applications = await ApplicationModel.find({
//         companyId: companyId,
//         createdAt: { $gte: startOfDay, $lte: endOfDay }
//     }).populate("userId jobId");

//     console.log("Applications found:", applications);

//     if (!applications || applications.length === 0) {
//         return next(new Error("❌ No applications found for this date and company.", { cause: 404 }));
//     }
//     console.log("Applications found:", applications.length);

  
//     const workbook = new ExcelJS.Workbook();
//     const worksheet = workbook.addWorksheet("Applications");


//     worksheet.columns = [
//         { header: "Application ID", key: "_id", width: 30 },
//         { header: "Candidate Name", key: "userName", width: 20 },
//         { header: "Candidate Email", key: "userEmail", width: 30 },
//         { header: "Job Title", key: "jobTitle", width: 25 },
//         { header: "Status", key: "status", width: 15 },
//         { header: "Applied Date", key: "createdAt", width: 20 }
//     ];

//     // إدراج البيانات
//     applications.forEach(app => {
//         worksheet.addRow({
//             _id: app._id,
//             userName: app.userId?.name || "N/A",
//             userEmail: app.userId?.email || "N/A",
//             jobTitle: app.jobId?.jobTitle || "N/A",
//             status: app.status,
//             createdAt: app.createdAt.toISOString().split("T")[0]
//         });
//     });


//     res.setHeader(
//         "Content-Type",
//         "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//     );
//     res.setHeader(
//         "Content-Disposition",
//         `attachment; filename=applications_${date}.xlsx`
//     );

//     await workbook.xlsx.write(res);
//     res.end();
// });









