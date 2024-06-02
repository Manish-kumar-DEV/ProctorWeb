import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'default_cloud_name',
    api_key: process.env.CLOUDINARY_API_KEY || 'default_api_key',
    api_secret: process.env.CLOUDINARY_API_SECRET || 'default_api_secret',
});

export const uploadImageToCloudinary = async (filePath: string) => {

    try {
        console.log(`Uploading image: ${filePath}`);
        const result = await cloudinary.uploader.upload(filePath, {
            folder: 'user_images',
        });
        console.log('Upload successful:', result);
        return result.secure_url;
    } catch (error) {
        console.error('Error during image upload:', error);
        throw new Error('Image upload failed');
    }
};

export default cloudinary;
