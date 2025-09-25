import multer from "multer";
import path from "path";

// config du stockage
const storage = multer.diskStorage({
  destination: (_, file, cb) => {
    cb(null, "public/uploads"); 
  },
  filename: (_, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // ex: 16942737363.png
  },
});

// filtre (optionnel) -> images et audio
const fileFilter = (_: any, file: any, cb: any) => {
  if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("audio/")) {
    cb(null, true);
  } else {
    cb(new Error("Seules les images et les fichiers audio sont autorisés !"), false);
  }
};

export const upload = multer({ storage, fileFilter });
