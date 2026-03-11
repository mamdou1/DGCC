/*
=========================================
IMPORTS
=========================================
*/

const models = require("../dgcc_models");

// Assigner les modèles avec les bons noms
const Document = models.documents;
const TypeDocument = models.typedocuments;
const MetaField = models.metafields;
const DocumentValue = models.documentvalues;
const Pieces = models.pieces;
const PieceMetaField = models.piece_meta_fields;
const PieceValue = models.piece_values;
const PiecesFichier = models.pieces_fichiers;
const DocumentPieces = models.document_pieces;
const DocumentFichier = models.document_fichiers;

// DEBUG: Vérifier que tous les modèles sont chargés
// console.log("📦 Modèles DGCC chargés:", {
//   Document: !!Document,
//   TypeDocument: !!TypeDocument,
//   MetaField: !!MetaField,
//   DocumentValue: !!DocumentValue,
//   Pieces: !!Pieces,
// });

// // Vérifier les associations
// console.log("🔍 Associations de Document:", Object.keys(Document.associations));
// console.log(
//   "🔍 Associations de TypeDocument:",
//   Object.keys(TypeDocument.associations),
// );
// console.log(
//   "🔍 Associations de MetaField:",
//   Object.keys(MetaField.associations),
// );
// console.log(
//   "🔍 Associations de DocumentValue:",
//   Object.keys(DocumentValue.associations),
// );
// console.log("🔍 Associations de Pieces:", Object.keys(Pieces.associations));

/*
=========================================
UTILITAIRE INCLUDE DGCC
=========================================
*/

const buildDGCCInclude = () => {
  return [
    /*
    =========================================
    1️⃣ TYPE DOCUMENT + META FIELDS
    =========================================
    */
    {
      model: TypeDocument,
      as: "type_document", // D'après l'association dans init-models.js
      include: [
        {
          model: MetaField,
          as: "metafields", // D'après l'association dans init-models.js
        },
      ],
    },

    /*
    =========================================
    2️⃣ DOCUMENT VALUES + META FIELD
    =========================================
    */
    {
      model: DocumentValue,
      as: "documentvalues",
      include: [
        {
          model: MetaField,
          as: "meta_field", // D'après l'association dans init-models.js
        },
      ],
    },

    /*
    =========================================
    3️⃣ DOCUMENT FICHIERS DIRECTS
    =========================================
    */
    {
      model: DocumentFichier,
      as: "document_fichiers", // D'après l'association dans init-models.js
      required: false,
      attributes: {
        exclude: ["document_value_id"],
      },
    },

    /*
    =========================================
    4️⃣ PIECES + DISPONIBLE
    =========================================
    */
    {
      model: Pieces,
      as: "piece_id_pieces", // D'après l'association dans init-models.js
      through: {
        model: DocumentPieces,
        attributes: ["disponible"],
      },

      include: [
        {
          model: PieceMetaField,
          as: "piece_meta_fields", // D'après l'association dans init-models.js
          include: [
            {
              model: PieceValue,
              as: "piece_values", // D'après l'association dans init-models.js
              required: false,
              include: [
                {
                  model: PiecesFichier,
                  as: "pieces_fichiers", // D'après l'association dans init-models.js
                  required: false,
                },
              ],
            },
          ],
        },
        {
          model: PiecesFichier,
          as: "pieces_fichiers", // D'après l'association dans init-models.js
          where: { piece_value_id: null },
          required: false,
        },
      ],
    },
  ];
};

/*
=========================================
GET DOCUMENT FULL BY ID
=========================================
*/

exports.getDocumentFullByID = async (req, res) => {
  try {
    const { id } = req.params;

    console.log(`🔍 Récupération document ${id}`);

    const document = await Document.findByPk(id, {
      include: buildDGCCInclude(),
      attributes: {
        include: [
          ["created_at", "createdAt"],
          ["updated_at", "updatedAt"],
        ],
      },
    });

    if (!document) {
      return res.status(404).json({
        message: "Document non trouvé",
      });
    }

    return res.json(document);
  } catch (error) {
    console.error("❌ Erreur récupération document:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

/*
=========================================
GET ALL DOCUMENTS FULL
=========================================
*/

exports.getAllDocumentsFull = async (req, res) => {
  try {
    console.log("🔍 Récupération de tous les documents depuis DGCC...");

    const documents = await Document.findAll({
      include: buildDGCCInclude(),
      order: [["id", "DESC"]],
      attributes: {
        exclude: ["createdAt", "updatedAt"],
        include: [
          ["created_at", "createdAt"],
          ["updated_at", "updatedAt"],
        ],
      },
    });

    console.log(`✅ ${documents.length} documents récupérés`);

    return res.json(documents);
  } catch (error) {
    console.error("❌ Erreur récupération documents:", error.message);
    return res.status(500).json({ error: error.message });
  }
};
