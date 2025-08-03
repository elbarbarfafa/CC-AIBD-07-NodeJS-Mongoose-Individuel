const multer = require('multer');
const path = require('path');

// Configuration du stockage avec multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Dossier où stocker les fichiers
    const uploadDir = './uploads';
    
    // Créer le dossier s'il n'existe pas
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Renommer le fichier pour éviter les conflits
    // Format: timestamp-nomOriginal
    const timestamp = Date.now();
    const extension = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, extension);
    cb(null, `${timestamp}-${baseName}${extension}`);
  }
});

// Filtrer les types de fichiers autorisés
const fileFilter = (req, file, cb) => {
  // Exemple: autoriser seulement les images
  const allowedTypes = /jpeg|jpg|png|pdf|txt|docx/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Type de fichier non autorisé'));
  }
};

// Configuration de multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Limite de 5MB
  },
  fileFilter: fileFilter
});

module.exports = upload;