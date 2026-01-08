"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStorageStore = getStorageStore;
const multer = require('multer');
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
function getStorageStore(dirLocation) {
    // Create folder if not exists
    const uploadDir = dirLocation || './uploads/images';
    if (!fs_1.default.existsSync(uploadDir)) {
        fs_1.default.mkdirSync(uploadDir, { recursive: true });
    }
    // Configure Multer storage
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, uploadDir); // specify folder
        },
        filename: function (req, file, cb) {
            const ext = path_1.default.extname(file.originalname);
            const name = path_1.default.basename(file.originalname, ext);
            cb(null, `${name}-${Date.now()}${ext}`);
        },
    });
    // Initialize upload middleware
    const upload = multer({ storage });
    return upload;
}
