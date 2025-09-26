// import { Router } from "express";
// import { authentication } from "../../middlewere/authontcation.middlewere.js";
// import { addJobOpportunity, exportApplicationsToExcel,updateJobOpportunity, updateApplicationStatus,deleteJobOpportunity, applyForJob, getAllJobs, getAmanyJobs, uploadUserCV, getApplicationsForJob } from "./service/jop.service.js";
// import { fileValidationTypes, uploadCloudFile } from "../../utlis/multer/cloud.multer.js";
// const router = Router()


// router.post("/addJobOpportunity/:companyId", authentication(), addJobOpportunity)
// router.patch("/updateJobOpportunity/:jobId", authentication(), updateJobOpportunity)
// router.delete("/deleteJobOpportunity/:jobId", authentication(), deleteJobOpportunity)
// router.get("/jops/:companyId", getAllJobs)
// router.get("/jops", getAllJobs)
// router.get("/getAmanyJobs", getAmanyJobs)
// router.post("/applyForJob", authentication(), applyForJob);
// router.post("/uploadCV/:applicationId", authentication(), uploadCloudFile(fileValidationTypes.document).single("document"), uploadUserCV);
// router.get("/applications/:jobId", authentication(), getApplicationsForJob);
// router.patch("/updateApplicationStatus", authentication(), updateApplicationStatus);
// router.get("/exportApplicationsToExcel", authentication(), exportApplicationsToExcel);
// export default router