const multer = require('multer');
import path from 'path';
import fs from 'fs';

export function getStorageStore(dirLocation: string) {
  // Create folder if not exists
  const uploadDir = dirLocation || './uploads/images';
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Configure Multer storage
  const storage = multer.diskStorage({
    destination: function (req: any, file: any, cb: any) {
      cb(null, uploadDir); // specify folder
    },
    filename: function (req: any, file: any, cb: any) {
      const ext = path.extname(file.originalname);
      const name = path.basename(file.originalname, ext);
      cb(null, `${name}-${Date.now()}${ext}`);
    },
  });

  // Initialize upload middleware
  const upload = multer({ storage });
  return upload;
}
