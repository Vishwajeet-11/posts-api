import multer from 'multer';

// configure memory storage with 5 MB limit
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }
});

// expose helpers
export const uploadSingleImage = upload.single('image');
export const uploadMultipleImages = upload.array('images', 5); // example, up to 5
export default upload;
