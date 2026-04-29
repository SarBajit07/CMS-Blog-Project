const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary with credentials from .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Set up the storage engine
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'cms_blog_uploads', // The folder in your Cloudinary account
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'gif', 'mp4', 'mov'],
    resource_type: 'auto' // Important for accepting both images and videos
  },
});

// Initialize multer with the storage engine
const upload = multer({ storage: storage });

module.exports = { cloudinary, upload };
