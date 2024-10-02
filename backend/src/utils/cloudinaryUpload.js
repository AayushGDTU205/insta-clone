import { v2 as cloudinary } from "cloudinary";
import fs from 'fs';
import ErrorHandler from "./ErrorHandler.js";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
  
const uploadOnCloudinary= async (file) => {
    try {
        if (!file) return null;
        const response = await cloudinary.uploader.upload(file);
        fs.unlinkSync(file);
        console.log('File is uploaded on cloudinary' + response.url);
        return response;
    } catch (error) {
        throw new ErrorHandler(400, 'Cannot upload image');
    }
}
const uploadBatchOnCloudinary = async (files) => {
    try {
        if (!files) return null;
        let multiPicPromise = files.map(async (picture) => {
            const reponse=await cloudinary.uploader.upload(picture.path);
            fs.unlinkSync(picture.path);
            return reponse;
        })
        // console.log(multiPicPromise);
        let responses = await Promise.all(multiPicPromise);
        // console.log("response in upload: ", responses);
        return responses;

    } catch (error) {
        throw new ErrorHandler(500,error.message || 'Bulk Image Upload Failed');
    }
}
export { uploadOnCloudinary,uploadBatchOnCloudinary };