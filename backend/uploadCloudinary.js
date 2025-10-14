import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Path to your images folder
const imagesFolder = '../public'; // Go up from backend to root, then into public

// Get all image files
const files = fs.readdirSync(imagesFolder)
  .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file));

console.log(`Found ${files.length} images to upload...`);

// Upload each file
async function uploadImages() {
  for (const file of files) {
    const filePath = path.join(imagesFolder, file);
    
    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: 'tote-bags',
        public_id: path.parse(file).name,
        overwrite: true
      });
      
      console.log(`✅ Uploaded: ${file}`);
      console.log(`   URL: ${result.secure_url}\n`);
    } catch (error) {
      console.error(`❌ Failed to upload ${file}:`, error.message);
    }
  }
  
  console.log('Upload complete!');
}

uploadImages();