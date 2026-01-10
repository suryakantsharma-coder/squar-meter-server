// routes/upload.js
// import express from 'express';
// import multer from 'multer';
// import path from 'path';
// import fs from 'fs';

// const router = express.Router();

// // Create folder if not exists
// const uploadDir = './uploads/images';
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// // Configure Multer storage
// const storage = multer.diskStorage({
//   destination: function (req: any, file: any, cb: any) {
//     cb(null, uploadDir); // specify folder
//   },
//   filename: function (req: any, file: any, cb: any) {
//     const ext = path.extname(file.originalname);
//     const name = path.basename(file.originalname, ext);
//     cb(null, `${name}-${Date.now()}${ext}`);
//   },
// });

// // Initialize upload middleware
// const upload = multer({ storage });

// // POST endpoint to handle image upload
// router.post('/image', upload.single('image'), (req, res) => {
//   try {
//     console.log('File received:', req);
//     if (!req?.file) return res.status(400).json({ success: false, message: 'No file uploaded' });

//     const filePath = `/uploads/images/${req?.file?.filename}`;
//     res.json({
//       success: true,
//       message: 'Image uploaded successfully',
//       filePath,
//     });
//   } catch (err) {
//     console.error('Upload error:', err);
//     res.status(500).json({ success: false, message: 'Upload failed' });
//   }
// });

// export default router;

import express from 'express';
// @ts-expect-error -- multer is not typed
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import cors from 'cors';

const app = express();
const PORT = 5000;

// Enable CORS
app.use(cors());
app.use(express.json());

// Create uploads directory if it doesn't exist
const uploadDir = './uploads/assets';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req: any, file: any, cb: any) => {
    cb(null, uploadDir);
  },
  filename: (req: any, file: any, cb: any) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter to validate file types
const fileFilter = (req: any, file: any, cb: any) => {
  // Allowed file types
  const allowedMimes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'text/csv',
    'application/zip',
  ];

  const allowedExtensions = [
    '.jpg',
    '.jpeg',
    '.png',
    '.gif',
    '.webp',
    '.pdf',
    '.doc',
    '.docx',
    '.txt',
    '.csv',
    '.zip',
  ];

  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedMimes.includes(file.mimetype) && allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Unsupported file type: ${file.mimetype}. Allowed types: ${allowedExtensions.join(', ')}`,
      ),
      false,
    );
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Single file upload endpoint
app.post('/image', upload.single('file'), (req: any, res: any) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      file: {
        filename: req.file.filename,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: req.file.path,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error uploading file',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Multiple files upload endpoint
app.post('/api/upload-multiple', upload.array('files', 5), (req: any, res: any) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded',
      });
    }

    const files = req.files.map((file: any) => ({
      filename: file.filename,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      path: file.path,
    }));

    res.status(200).json({
      success: true,
      message: `${files.length} file(s) uploaded successfully`,
      files: files,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error uploading files',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default app;
