import * as dotenv from "dotenv"
import path from "node:path"
dotenv.config({ path: path.resolve('./src/config/.env') })
import * as cloudinary from 'cloudinary';


cloudinary.config({
    cloud_name: process.env.cloud_name,
    secure: true,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret
});

export default cloudinary.v2