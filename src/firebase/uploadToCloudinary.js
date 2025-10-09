import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs/promises';
import path from 'path';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { config as dotenvConfig } from 'dotenv';
import { fileURLToPath } from 'url';

dotenvConfig();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Debug: Log paths
console.log('Script directory:', __dirname);
console.log('Service account path:', path.resolve(__dirname, '../../../firebase/ob.json'));
console.log('Images directory:', path.resolve(__dirname, '../../public'));

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dhgkmjnvl',
  api_key: process.env.CLOUDINARY_API_KEY || '918398179487347',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'CuOmDJ7b9I-81gR0A4rF5xJYUZg', // REGENERATE AFTER USE!
});

// Configure Firebase Admin
let serviceAccount;
try {
  serviceAccount = path.resolve(__dirname, '../../../firebase/ob.json'); // Points to Desktop/firebase/ob.json
  await fs.access(serviceAccount); // Verify file exists
  console.log('Service account file found:', serviceAccount);
} catch (error) {
  console.error('Service account file not found. Please check path:', error.message);
  console.error('Expected at:', serviceAccount);
  process.exit(1);
}

initializeApp({
  credential: cert(serviceAccount),
});
const db = getFirestore();

// Directory with your images
const imagesDir = path.resolve(__dirname, '../../public'); // Points to obase-sam-app/public

async function uploadImages() {
  try {
    // Read all files in the images directory
    const files = await fs.readdir(imagesDir);
    const imageFiles = files.filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));

    if (imageFiles.length === 0) {
      console.log('No images found in public folder:', imagesDir);
      return;
    }

    for (const file of imageFiles) {
      const filePath = path.join(imagesDir, file);
      const publicId = path.parse(file).name;

      try {
        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(filePath, {
          folder: 'products',
          public_id: publicId,
        });

        // Save to Firestore
        await db.collection('products').add({
          name: publicId,
          imageUrl: result.secure_url,
          publicId: result.public_id,
          uploadedAt: new Date(),
        });

        console.log(`Uploaded and saved ${file}: ${result.secure_url}`);
      } catch (error) {
        console.error(`Failed to process ${file}:`, error.message);
      }
    }
  } catch (error) {
    console.error('Error reading directory:', imagesDir, error.message);
  }
}

uploadImages();

