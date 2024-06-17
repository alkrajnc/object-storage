import { Request } from "express";
import multer from "multer";
import "dotenv/config";

const storage = multer.diskStorage({
    destination: (req: Request, file, cb) => {
        cb(null, process.env.STORAGE_PATH);
    },
    filename: (req: Request, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Generate unique filename
    },
});

export const upload = multer({ storage: storage });
