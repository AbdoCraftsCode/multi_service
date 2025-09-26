import bcrypt from "bcrypt"

import CryptoJS from "crypto-js";

const secretKey = process.env.CRYPTO_SECRET_KEY || "default_secret_key"; 


export const encryptData = (plainText) => {
    return CryptoJS.AES.encrypt(plainText, secretKey).toString();
};


export const decryptData = (encryptedText) => {
    const bytes = CryptoJS.AES.decrypt(encryptedText, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
};

export const generatehash = ({ planText = "", salt = process.env.SALT } = {}) => {


    const hash = bcrypt.hashSync(planText, parseInt(salt))
    return hash
}



export const comparehash = ({ planText = "", valuehash } = {}) => {

    const match = bcrypt.compareSync(planText, valuehash);
    return match;
};