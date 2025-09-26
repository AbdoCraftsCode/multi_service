

import multer from "multer";


export const fileValidationTypes = {
    image: ['image/jpg', 'image/jpeg', 'image/png', 'image/gif'],
    document: ['application/json', 'application/pdf'],
};


export const uploadCloudFile = (fileValidation = []) => {



    const storage = multer.diskStorage({});



    function fileFilter(req, file, cb) {
        if (fileValidation.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("❌ الملف غير مدعوم!"), false);
        }
    }

    return multer({ storage, fileFilter });
};
