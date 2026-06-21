import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import config from '../config';

const uploadDir =
  config.upload.dir && path.isAbsolute(config.upload.dir)
    ? config.upload.dir
    : path.join(process.cwd(), config.upload.dir || 'uploads');

if (!fs.existsSync(uploadDir)) {
  try {
    fs.mkdirSync(uploadDir, { recursive: true });
  } catch (e) {
    console.warn('[upload] 无法创建目录：', uploadDir);
  }
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.png';
    const filename = `${uuidv4()}${ext}`;
    cb(null, filename);
  },
});

const ALLOWED_MIME = ['image/jpeg', 'image/jpg', 'image/png'];
const ALLOWED_EXT = ['.jpg', '.jpeg', '.png'];

const fileFilter = (_req: any, file: any, cb: any) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ALLOWED_MIME.includes(file.mimetype) && ALLOWED_EXT.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('仅支持 JPG / JPEG / PNG 格式'));
  }
};

const maxSize = Number(config.upload.maxSize) || 5 * 1024 * 1024;

const uploader = multer({
  storage,
  limits: { fileSize: maxSize, files: 1 },
  fileFilter,
});

export const uploadSingle = uploader.single('image');

export default uploader;
