// const multer = require("multer");
// const fs = require("fs");
// const path = require("path");
// const { Document } = require("../models"); // ✅ Importez Document, pas Liquidation

// const storage = multer.diskStorage({
//   destination: async (req, file, cb) => {
//     try {
//       const { documentId } = req.params;
//       const { upload_mode } = req.body;

//       const document = await Document.findByPk(documentId);

//       if (!document) {
//         return cb(new Error("Document introuvable"));
//       }

//       // Chemin de base pour le document
//       let uploadDir = path.join(
//         process.cwd(),
//         "uploads",
//         "documents",
//         `DOC-${documentId}`,
//       );

//       // MODE LOT UNIQUE
//       if (upload_mode === "LOT_UNIQUE") {
//         uploadDir = path.join(uploadDir, "LOT_UNIQUE");
//       } else {
//         // MODE INDIVIDUEL - dossier par défaut
//         uploadDir = path.join(uploadDir, "PIECES");
//       }

//       // Création récursive du dossier
//       fs.mkdirSync(uploadDir, { recursive: true });

//       cb(null, uploadDir);
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
//   limits: {
//     fileSize: 10 * 1024 * 1024, // 10MB
//   },
// });

const multer = require("multer");
const fs = require("fs");
const path = require("path");
const {
  Document,
  Pieces,
  TypeDocument,
  Direction,
  SousDirection,
  Division,
  Section,
  Service,
} = require("../models");

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      const { documentId, pieceId } = req.params;
      const { upload_mode, piece_value_id } = req.body;

      // 1. Récupérer le document
      const document = await Document.findByPk(documentId);
      if (!document) {
        return cb(new Error("Document introuvable"));
      }

      // 2. Récupérer le type de document avec toutes ses associations
      const typeDocument = await TypeDocument.findByPk(
        document.type_document_id,
        {
          include: [
            { model: Direction, as: "direction" },
            { model: Service, as: "service" },
            { model: SousDirection, as: "sousDirection" },
            { model: Division, as: "division" },
            { model: Section, as: "section" },
          ],
        },
      );

      if (!typeDocument) {
        return cb(new Error("Type de document introuvable"));
      }

      // 3. Déterminer l'entité concernée (priorité à la plus spécifique)
      let entiteeConcernee = null;
      let typeEntite = null;
      let libelle = null;

      // Ordre de priorité : Section > Division > Sous-direction > Service > Direction
      if (typeDocument.section) {
        entiteeConcernee = typeDocument.section;
        typeEntite = "Section";
        libelle = entiteeConcernee.libelle;
        console.log("📁 Entité concernée: SECTION");
      } else if (typeDocument.division) {
        entiteeConcernee = typeDocument.division;
        typeEntite = "Division";
        libelle = entiteeConcernee.libelle;
        console.log("📁 Entité concernée: DIVISION");
      } else if (typeDocument.sousDirection) {
        entiteeConcernee = typeDocument.sousDirection;
        typeEntite = "Sous-direction";
        libelle = entiteeConcernee.libelle;
        console.log("📁 Entité concernée: SOUS-DIRECTION");
      } else if (typeDocument.service) {
        entiteeConcernee = typeDocument.service;
        typeEntite = "Service";
        libelle = entiteeConcernee.libelle;
        console.log("📁 Entité concernée: SERVICE");
      } else if (typeDocument.direction) {
        entiteeConcernee = typeDocument.direction;
        typeEntite = "Direction";
        libelle = entiteeConcernee.libelle;
        console.log("📁 Entité concernée: DIRECTION");
      }

      // Valeurs par défaut si aucune entité trouvée
      typeEntite = typeEntite || "NON_ASSIGNE";
      libelle = libelle || "NON_ASSIGNE";
      const typeDocLibelle = typeDocument.nom || "TYPE_INCONNU";

      console.log("📁 Type entité:", typeEntite);
      console.log("📁 Libellé entité:", libelle);
      console.log("📁 Type document:", typeDocLibelle);

      // 4. Récupérer le libellé de la pièce si pieceId est fourni
      let pieceLibelle = "PIECE_INCONNUE";
      if (pieceId) {
        const piece = await Pieces.findByPk(pieceId);
        if (piece) {
          pieceLibelle = piece.libelle
            .replace(/[^a-zA-Z0-9\s-]/g, "")
            .replace(/\s+/g, "_")
            .toUpperCase()
            .substring(0, 50);
        }
      }

      // 5. Construire le chemin selon l'arborescence souhaitée :
      // uploads/DGCC-file/ -> [TypeEntite] -> [LibelleEntite] -> [NomTypeDocument] -> DOC-[documentId]
      let uploadDir = path.join(
        process.cwd(),
        "uploads",
        "DGCC-file",
        typeEntite, // "Direction", "Service", "Sous-direction", "Division", "Section"
        libelle, // "Direction Générale", "Service Informatique", etc.
        typeDocLibelle, // "Rapport d'activité", "Facture", etc.
        `DOC-${documentId}`, // "DOC-42"
      );

      // MODE LOT UNIQUE
      if (upload_mode === "LOT_UNIQUE") {
        uploadDir = path.join(uploadDir, "LOT_UNIQUE");
      }
      // MODE INDIVIDUEL
      else {
        if (piece_value_id) {
          // Cas avec métadonnée spécifique
          uploadDir = path.join(
            uploadDir,
            "PIECES INDIVIDUEL",
            pieceLibelle,
            `META-${piece_value_id}`,
          );
        } else if (pieceId) {
          // Cas pièce simple sans métadonnée
          uploadDir = path.join(uploadDir, "PIECES INDIVIDUEL", pieceLibelle);
        } else {
          // Fallback
          uploadDir = path.join(uploadDir, "PIECES INDIVIDUEL", "AUTRES");
        }
      }

      // 6. Créer le dossier
      fs.mkdirSync(uploadDir, { recursive: true });
      console.log("✅ Dossier créé:", uploadDir);

      cb(null, uploadDir);
    } catch (err) {
      console.error("❌ Erreur dans destination multer:", err);
      cb(err);
    }
  },

  filename: (req, file, cb) => {
    const date = new Date().toISOString().split("T")[0];
    const unique = Date.now();
    const ext = path.extname(file.originalname);

    const originalName = path
      .basename(file.originalname, ext)
      .replace(/[^a-z0-9]/gi, "_")
      .substring(0, 30);

    cb(null, `${date}_${unique}_${originalName}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 10,
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Type de fichier non autorisé. Seuls PDF, JPEG et PNG sont acceptés.",
        ),
      );
    }
  },
});

module.exports = upload;
