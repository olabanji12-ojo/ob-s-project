import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Path to your images folder
const imagesFolder = '../public'; // Go up from backend to root, then into public

// Max file size for Cloudinary (10MB)
const MAX_SIZE = 10 * 1024 * 1024;

// Get all image files
const files = fs.readdirSync(imagesFolder)
  .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file));

console.log(`Found ${files.length} images to upload...`);

// Upload each file
async function uploadImages() {
  for (const file of files) {
    const filePath = path.join(imagesFolder, file);
    const stats = fs.statSync(filePath);
    let uploadPath = filePath;
    let isTemp = false;

    try {
      if (stats.size > MAX_SIZE) {
        console.log(`⚠️  ${file} is too large (${(stats.size / (1024 * 1024)).toFixed(2)}MB). Compressing...`);
        const tempPath = path.join(imagesFolder, `temp_${file}`);

        await sharp(filePath)
          .resize({ width: 2560, withoutEnlargement: true }) // Resize to 2.5K width max
          .jpeg({ quality: 70, progressive: true })
          .toFile(tempPath);

        uploadPath = tempPath;
        isTemp = true;

        const newStats = fs.statSync(uploadPath);
        console.log(`✨ Compressed ${file} to ${(newStats.size / (1024 * 1024)).toFixed(2)}MB`);
      }

      const result = await cloudinary.uploader.upload(uploadPath, {
        folder: 'tote-bags',
        public_id: path.parse(file).name,
        overwrite: true
      });

      console.log(`✅ Uploaded: ${file}`);
      console.log(`   URL: ${result.secure_url}\n`);
    } catch (error) {
      console.error(`❌ Failed to upload ${file}:`, error.message);
    } finally {
      if (isTemp && fs.existsSync(uploadPath)) {
        fs.unlinkSync(uploadPath);
      }
    }
  }

  console.log('Upload complete!');
}

uploadImages();