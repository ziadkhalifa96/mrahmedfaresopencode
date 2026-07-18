import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const uploadsBase = path.join(__dirname, '..', '..', 'uploads');

const uploadFolders = ['avatars', 'courses', 'blog', 'payments', 'general'];
uploadFolders.forEach((folder) => {
  const dir = path.join(uploadsBase, folder);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = req.path.includes('avatar')
      ? 'avatars'
      : req.path.includes('course')
      ? 'courses'
      : req.path.includes('blog')
      ? 'blog'
      : req.path.includes('payment')
      ? 'payments'
      : 'general';
    cb(null, path.join(uploadsBase, folder));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('File type not allowed'));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});
