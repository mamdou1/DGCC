// controllers/import.controller.js
const { sequelize } = require("../models");
const {
  Document,
  TypeDocument,
  MetaField,
  DocumentValue,
  Pieces,
  PieceMetaField,
  PieceValue,
  PiecesFichier,
  DocumentPieces,
  DocumentFichier,
} = require("../models");
const logger = require("../config/logger.config");
const HistoriqueService = require("../services/historique.service");
const path = require("path");
const fs = require("fs");
const axios = require("axios");

// Fonction pour télécharger un fichier avec gestion d'erreur non-bloquante
const downloadFile = async (url, destination, token) => {
  try {
    const writer = fs.createWriteStream(destination);

    const response = await axios({
      url,
      method: "GET",
      responseType: "stream",
      headers: {
        Authorization: token,
      },
      timeout: 10000, // Timeout de 10 secondes
    });

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on("finish", () => {
        console.log(`✅ Fichier téléchargé: ${destination}`);
        resolve(true);
      });
      writer.on("error", (err) => {
        console.error(`❌ Erreur écriture fichier: ${err.message}`);
        reject(err);
      });
    });
  } catch (error) {
    console.error(`❌ Erreur téléchargement ${url}: ${error.message}`);
    return false; // Retourner false pour indiquer l'échec
  }
};

// Fonction utilitaire pour nettoyer le chemin du fichier
const cleanFilePath = (filePath) => {
  if (!filePath) return null;

  // Enlever les éventuels slash au début
  let cleanPath = filePath.startsWith("/") ? filePath.substring(1) : filePath;

  // S'assurer que le chemin commence par 'uploads/'
  if (!cleanPath.startsWith("uploads/")) {
    cleanPath = `uploads/${cleanPath}`;
  }

  return cleanPath;
};

/**
 * Fonction utilitaire pour importer un document depuis DGCC
 * @param {object} dgccDocument - Document DGCC complet
 * @param {object} options - Options d'import
 * @returns {Promise<object>} - Le document importé
 */
const importSingleDocument = async (dgccDocument, options = {}) => {
  const {
    transaction: externalTransaction,
    user = null,
    token = null,
  } = options;

  // Utiliser la transaction externe si fournie, sinon en créer une nouvelle
  const shouldCommit = !externalTransaction;
  const transaction = externalTransaction || (await sequelize.transaction());

  try {
    logger.info(`📥 Import du document DGCC #${dgccDocument.id}`);

    if (!dgccDocument) {
      throw new Error(`Document DGCC invalide`);
    }

    // 2. Importer le type de document
    const dgccType = dgccDocument.type_document;
    let localType = await TypeDocument.findOne({
      where: { code: dgccType.code },
      transaction,
    });

    if (!localType) {
      localType = await TypeDocument.create(
        {
          code: dgccType.code,
          nom: dgccType.nom,
          direction_id: dgccType.direction_id || null,
          service_id: dgccType.service_id || null,
          sous_direction_id: dgccType.sous_direction_id || null,
          division_id: dgccType.division_id || null,
          section_id: dgccType.section_id || null,
        },
        { transaction },
      );
    }

    // 3. Importer les meta fields du type
    const metaFieldMap = new Map();
    if (dgccType.metafields) {
      for (const meta of dgccType.metafields) {
        let localMeta = await MetaField.findOne({
          where: {
            type_document_id: localType.id,
            name: meta.name,
          },
          transaction,
        });

        if (!localMeta) {
          localMeta = await MetaField.create(
            {
              type_document_id: localType.id,
              name: meta.name,
              label: meta.label,
              field_type: meta.field_type,
              required: meta.required,
              position: meta.position,
            },
            { transaction },
          );
        }
        metaFieldMap.set(meta.id, localMeta);
      }
    }

    // 4. Créer le document local
    const localDocument = await Document.create(
      {
        type_document_id: localType.id,
      },
      { transaction },
    );

    // 5. Importer les valeurs du document
    if (dgccDocument.documentvalues) {
      for (const value of dgccDocument.documentvalues) {
        const localMeta = metaFieldMap.get(value.meta_field_id);
        if (localMeta) {
          await DocumentValue.create(
            {
              document_id: localDocument.id,
              meta_field_id: localMeta.id,
              value: value.value,
            },
            { transaction },
          );
        }
      }
    }

    // 6. Importer les fichiers du document (non bloquant)
    if (
      dgccDocument.document_fichiers &&
      dgccDocument.document_fichiers.length > 0
    ) {
      for (const file of dgccDocument.document_fichiers) {
        try {
          const fileName =
            file.new_file_name || file.filename || path.basename(file.fichier);
          const filePath = path.join(
            __dirname,
            "../testImportation",
            "imports",
            fileName,
          );

          // Créer le dossier si nécessaire
          fs.mkdirSync(path.dirname(filePath), { recursive: true });

          // Nettoyer le chemin du fichier
          const cleanPath = cleanFilePath(file.fichier);
          const fileUrl = `http://localhost:5000/${cleanPath}`;

          console.log("Téléchargement fichier document:", fileUrl);

          const downloadSuccess = await downloadFile(fileUrl, filePath, token);

          if (downloadSuccess) {
            await DocumentFichier.create(
              {
                document_id: localDocument.id,
                piece_id: null,
                piece_value_id: null,
                fichier: `testImportation/imports/${fileName}`,
                original_name: file.original_name,
                new_file_name: fileName,
                mode: file.mode || "INDIVIDUEL",
              },
              { transaction },
            );
          } else {
            logger.warn(`⚠️ Fichier document non téléchargé: ${file.fichier}`);
          }
        } catch (fileError) {
          logger.warn(`⚠️ Erreur fichier document: ${fileError.message}`);
          // Continuer l'import même si un fichier échoue
        }
      }
    }

    // 7. Importer les pièces et leurs associations
    if (
      dgccDocument.piece_id_pieces &&
      dgccDocument.piece_id_pieces.length > 0
    ) {
      for (const piece of dgccDocument.piece_id_pieces) {
        // Chercher la pièce locale par code
        let localPiece = await Pieces.findOne({
          where: { code_pieces: piece.code_pieces },
          transaction,
        });

        if (!localPiece) {
          localPiece = await Pieces.create(
            {
              code_pieces: piece.code_pieces,
              libelle: piece.libelle,
            },
            { transaction },
          );
        }

        // Associer la pièce au document
        await DocumentPieces.create(
          {
            document_id: localDocument.id,
            piece_id: localPiece.id,
            disponible: piece.document_pieces?.disponible || false,
          },
          { transaction },
        );

        // Importer les meta fields des pièces
        if (piece.piece_meta_fields && piece.piece_meta_fields.length > 0) {
          for (const pieceMeta of piece.piece_meta_fields) {
            let localPieceMeta = await PieceMetaField.findOne({
              where: {
                piece_id: localPiece.id,
                name: pieceMeta.name,
              },
              transaction,
            });

            if (!localPieceMeta) {
              localPieceMeta = await PieceMetaField.create(
                {
                  piece_id: localPiece.id,
                  name: pieceMeta.name,
                  label: pieceMeta.label,
                  field_type: pieceMeta.field_type,
                  required: pieceMeta.required,
                  position: pieceMeta.position,
                },
                { transaction },
              );
            }

            // Importer les valeurs des meta fields
            if (pieceMeta.piece_values && pieceMeta.piece_values.length > 0) {
              for (const pieceValue of pieceMeta.piece_values) {
                await PieceValue.create(
                  {
                    document_id: localDocument.id,
                    piece_id: localPiece.id,
                    piece_meta_field_id: localPieceMeta.id,
                    value: pieceValue.value,
                    row_id: pieceValue.row_id,
                  },
                  { transaction },
                );

                // Importer les fichiers associés aux valeurs (non bloquant)
                if (
                  pieceValue.pieces_fichiers &&
                  pieceValue.pieces_fichiers.length > 0
                ) {
                  for (const file of pieceValue.pieces_fichiers) {
                    try {
                      const fileName =
                        file.new_file_name ||
                        file.filename ||
                        path.basename(file.fichier);
                      const filePath = path.join(
                        __dirname,
                        "../testImportation",
                        "imports",
                        "pieces",
                        fileName,
                      );

                      fs.mkdirSync(path.dirname(filePath), { recursive: true });

                      const cleanPath = cleanFilePath(file.fichier);
                      const fileUrl = `http://localhost:5000/${cleanPath}`;

                      console.log(
                        "Téléchargement fichier pièce valeur:",
                        fileUrl,
                      );

                      const downloadSuccess = await downloadFile(
                        fileUrl,
                        filePath,
                        token,
                      );

                      if (downloadSuccess) {
                        await PiecesFichier.create(
                          {
                            document_id: localDocument.id,
                            piece_id: localPiece.id,
                            piece_value_id: pieceValue.id,
                            fichier: `testImportation/imports/pieces/${fileName}`,
                            original_name: file.original_name,
                            new_file_name: fileName,
                            mode: file.mode || "INDIVIDUEL",
                          },
                          { transaction },
                        );
                      } else {
                        logger.warn(
                          `⚠️ Fichier pièce valeur non téléchargé: ${file.fichier}`,
                        );
                      }
                    } catch (fileError) {
                      logger.warn(
                        `⚠️ Erreur fichier pièce valeur: ${fileError.message}`,
                      );
                      // Continuer l'import même si un fichier échoue
                    }
                  }
                }
              }
            }
          }
        }

        // Importer les fichiers directs des pièces (non bloquant)
        if (piece.pieces_fichiers && piece.pieces_fichiers.length > 0) {
          for (const file of piece.pieces_fichiers) {
            try {
              const fileName =
                file.new_file_name ||
                file.filename ||
                path.basename(file.fichier);
              const filePath = path.join(
                __dirname,
                "../testImportation",
                "imports",
                "pieces",
                fileName,
              );

              fs.mkdirSync(path.dirname(filePath), { recursive: true });

              const cleanPath = cleanFilePath(file.fichier);
              const fileUrl = `http://localhost:5000/${cleanPath}`;

              console.log("Téléchargement fichier pièce direct:", fileUrl);

              const downloadSuccess = await downloadFile(
                fileUrl,
                filePath,
                token,
              );

              if (downloadSuccess) {
                await PiecesFichier.create(
                  {
                    document_id: localDocument.id,
                    piece_id: localPiece.id,
                    piece_value_id: null,
                    fichier: `testImportation/imports/pieces/${fileName}`,
                    original_name: file.original_name,
                    new_file_name: fileName,
                    mode: file.mode || "INDIVIDUEL",
                  },
                  { transaction },
                );
              } else {
                logger.warn(
                  `⚠️ Fichier pièce direct non téléchargé: ${file.fichier}`,
                );
              }
            } catch (fileError) {
              logger.warn(
                `⚠️ Erreur fichier pièce direct: ${fileError.message}`,
              );
              // Continuer l'import même si un fichier échoue
            }
          }
        }
      }
    }

    // Commit seulement si c'est notre transaction
    if (shouldCommit) {
      await transaction.commit();
    }

    logger.info(`✅ Document #${dgccDocument.id} importé avec succès`);

    return localDocument;
  } catch (error) {
    // Rollback seulement si c'est notre transaction
    if (shouldCommit) {
      await transaction.rollback();
    }
    logger.error(
      `❌ Erreur import document #${dgccDocument.id}: ${error.message}`,
    );
    throw error;
  }
};

// Importer un document depuis DGCC (route API)
exports.importDocumentFromDGCC = async (req, res) => {
  try {
    const { documentId } = req.params;

    // Récupérer le token depuis l'en-tête Authorization
    const token = req.headers.authorization;

    const response = await axios.get(
      `http://localhost:5000/api/dgcc/${documentId}/full`,
      {
        headers: {
          Authorization: token, // Passer le token complet
        },
      },
    );

    const dgccDocument = response.data;

    const localDocument = await importSingleDocument(dgccDocument, {
      user: req.user,
      token, // Passer le token si nécessaire
    });

    // Journalisation dans l'historique
    await HistoriqueService.logCreate(req, "document", localDocument);

    res.status(201).json({
      message: "Document importé avec succès",
      documentId: localDocument.id,
    });
  } catch (error) {
    logger.error("❌ Erreur import document:", error);
    res.status(500).json({
      message: "Erreur lors de l'import",
      error: error.message,
    });
  }
};

// Modifiez importAllDocumentsFromDGCC
exports.importAllDocumentsFromDGCC = async (req, res) => {
  // Créer une transaction globale pour tout l'import
  const transaction = await sequelize.transaction();

  try {
    logger.info("📥 Import de tous les documents depuis DGCC");

    // Récupérer le token
    const token = req.headers.authorization;

    // Récupérer tous les documents via l'API /full
    const response = await axios.get(`http://localhost:5000/api/dgcc/full`, {
      headers: {
        Authorization: token,
      },
    });

    const allDocuments = response.data;

    logger.info(`📋 ${allDocuments.length} documents trouvés dans DGCC`);

    const results = {
      total: allDocuments.length,
      success: 0,
      failed: 0,
      errors: [],
      importedIds: [],
    };

    // Importer chaque document dans la même transaction
    for (const doc of allDocuments) {
      try {
        const localDocument = await importSingleDocument(doc, {
          transaction,
          user: req.user,
          token, // Passer le token
        });

        results.success++;
        results.importedIds.push(localDocument.id);
        logger.info(
          `✅ Document ${doc.id} importé (local ID: ${localDocument.id})`,
        );
      } catch (error) {
        results.failed++;
        results.errors.push({
          id: doc.id,
          error: error.message || "Erreur inconnue",
        });
        logger.error(`❌ Échec import document ${doc.id}:`, error.message);
      }
    }

    // Commit la transaction globale si tout s'est bien passé
    await transaction.commit();

    logger.info(
      `✅ Import terminé: ${results.success}/${results.total} succès`,
    );

    res.json({
      message: "Import terminé",
      results,
    });
  } catch (error) {
    // Rollback en cas d'erreur globale
    await transaction.rollback();

    logger.error("❌ Erreur import tous les documents:", error);
    res.status(500).json({
      message: "Erreur lors de l'import global",
      error: error.message,
    });
  }
};
