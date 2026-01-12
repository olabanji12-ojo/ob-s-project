/**
 * Cloudinary Upload Utility
 * 
 * This utility handles unsigned uploads to Cloudinary from the frontend.
 * It uses the cloud name 'dhgkmjnvl' found in the codebase.
 */

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dhgkmjnvl/image/upload';
const DEFAULT_UPLOAD_PRESET = 'ml_default'; // User should ensure this exists as an unsigned preset

/**
 * Uploads a file to Cloudinary
 * @param {File} file - The file object to upload
 * @param {string} [preset] - Cloudinary upload preset (unsigned)
 * @returns {Promise<string>} - The secure URL of the uploaded image
 */
export const uploadToCloudinary = async (file, preset = DEFAULT_UPLOAD_PRESET) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', preset);
    formData.append('folder', 'obase_uploads'); // Optional: organize in a folder

    try {
        const response = await fetch(CLOUDINARY_URL, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'Upload failed');
        }

        const data = await response.json();
        return data.secure_url;
    } catch (error) {
        console.error('Cloudinary Upload Error:', error);
        throw error;
    }
};
