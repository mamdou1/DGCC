// const multer = require("multer");
// const fs = require("fs");
// const path = require("path");
// const { Document } = require("../models");

// const storage = multer.diskStorage({
//   destination: async (req, file, cb) => {
//     try {
//       const { documentId } = req.params;

//       const document = await Document.findByPk(documentId);

//       if (!document) {
//         return cb(new Error("Document introuvable"));
//       }

//       const dir = path.join("uploads", "Documents", `DOC-${documentId}`);

//       fs.mkdirSync(dir, { recursive: true });
//       cb(null, dir);
//     } catch (err) {
//       cb(err);
//     }
//   },

//   filename: (req, file, cb) => {
//     const date = new Date().toISOString().split("T")[0];
//     const unique = Date.now();
//     const ext = path.extname(file.originalname);

//     cb(null, `${date}_${unique}${ext}`);
//   },
// });

// module.exports = multer({
//   storage,
//   limits: { fileSize: 5 * 1024 * 1024 },
// });

const multer = require("multer");
const fs = require("fs");
const path = require("path");
const slugify = require("../utils/slugify");
const { Document, Pieces } = require("../models");

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      const { documentId, pieceId } = req.params;

      const document = await Document.findByPk(documentId);
      const piece = await Pieces.findByPk(pieceId);

      if (!document || !piece) {
        return cb(new Error("Document ou pièce introuvable"));
      }

      const folder = slugify(piece.libelle);
      const dir = path.join(
        "uploads",
        "documents",
        `DOC-${documentId}`,
        folder,
      );

      fs.mkdirSync(dir, { recursive: true });
      cb(null, dir);
    } catch (err) {
      cb(err);
    }
  },

  filename: (req, file, cb) => {
    const date = new Date().toISOString().split("T")[0];
    const unique = Date.now();
    const ext = path.extname(file.originalname);

    cb(null, `${date}_${unique}${ext}`);
  },
});

module.exports = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});
