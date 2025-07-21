import multer from "multer"
import path from "path"
import fs from "fs"

const uploadDir = process.env.UPLOAD_DIR || "./uploads"
const maxFileSize = Number.parseInt(process.env.MAX_FILE_SIZE || "5242880") // 5MB default

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname))
  },
})

const fileFilter = (req: any, file: any, cb: any) => {
  // Accept only PDF, PNG, JPG, JPEG
  const allowedTypes = /pdf|png|jpg|jpeg/
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = allowedTypes.test(file.mimetype)

  if (mimetype && extname) {
    return cb(null, true)
  } else {
    cb(new Error("Apenas arquivos PDF, PNG, JPG e JPEG são permitidos"))
  }
}

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: maxFileSize,
  },
})

export const uploadMiddleware = upload.fields([
  { name: "bilhete_identidade", maxCount: 1 },
  { name: "certificado_ensino", maxCount: 1 },
  { name: "declaracao_notas", maxCount: 1 },
  { name: "declaracao_matricula", maxCount: 1 },
  { name: "carta_recomendacao", maxCount: 1 },
])
