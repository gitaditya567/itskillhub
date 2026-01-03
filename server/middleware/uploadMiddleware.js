const multer = require('multer');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const dotenv = require('dotenv');

dotenv.config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cloudinary Storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        return {
            folder: 'it-skillhub',
            resource_type: 'auto', // Automatically detect image or raw (pdf)
            allowed_formats: ['jpg', 'png', 'jpeg', 'pdf'],
            public_id: `${file.fieldname}-${Date.now()}`,
        };
    },
});

const upload = multer({ storage });

module.exports = upload;
