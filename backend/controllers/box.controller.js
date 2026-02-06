const { Box, Document, Trave } = require("../models");

// --- Méthodes de gestion de Box ---

exports.create = async (req, res) => {
  try {
    const data = await Box.create({
      ...req.body,
      current_count: 0, // Initialisation sécurisée
    });
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la création du box",
      error: error.message,
    });
  }
};

exports.findAll = async (req, res) => {
  try {
    const data = await Box.findAll({
      include: [
        {
          model: Trave,
          as: "trave", // Vérifie que cet alias correspond à celui dans Rayon.associate
        },
      ],
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des box",
      error: error.message,
    });
  }
};

exports.findById = async (req, res) => {
  try {
    const data = await Box.findByPk(req.params.id, {
      include: [
        {
          model: Document,
          as: "documents", // <--- L'alias défini dans Box.associate
        },
      ],
    });
    if (!data) return res.status(404).json({ message: "Box non trouvé" });
    res.json(data);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération du box",
      error: error.message,
    });
  }
};

exports.update = async (req, res) => {
  try {
    const { current_count, ...updateData } = req.body;
    const [updated] = await Box.update(updateData, {
      where: { id: req.params.id },
    });

    if (updated === 0)
      return res
        .status(404)
        .json({ message: "Box non trouvé ou aucune modification" });
    res.json({ success: true, message: "Box mis à jour" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la mise à jour", error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const box = await Box.findByPk(req.params.id);
    if (!box) return res.status(404).json({ message: "Box non trouvé" });

    if (box.current_count > 0) {
      return res.status(400).json({
        message: "Impossible de supprimer un box contenant des documents",
      });
    }

    await Box.destroy({ where: { id: req.params.id } });
    res.json({ success: true, message: "Box supprimé" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la suppression", error: error.message });
  }
};

// --- Logique d'archivage (Ajout/Retrait) ---

exports.addDocumentToBox = async (req, res) => {
  try {
    const { boxId, documentId } = req.params;
    const box = await Box.findByPk(boxId);
    const doc = await Document.findByPk(documentId);

    if (!box || !doc)
      return res.status(404).json({ message: "Box ou Document introuvable" });

    // Vérification Capacité
    if (box.current_count >= box.capacite_max) {
      return res
        .status(400)
        .json({ message: "Capacité maximale atteinte pour ce box" });
    }

    // Vérification Type
    if (box.type_document_id && box.type_document_id !== doc.type_document_id) {
      return res
        .status(400)
        .json({ message: "Le type de document ne correspond pas à ce box" });
    }

    // Mise à jour
    if (!box.type_document_id) box.type_document_id = doc.type_document_id;
    box.current_count += 1;
    doc.box_id = box.id;

    await box.save();
    await doc.save();

    res.json({ success: true, current_count: box.current_count });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de l'ajout du document",
      error: error.message,
    });
  }
};

// exports.addDocumentToBox = async (req, res) => {
//   try {
//     const { boxId, documentId } = req.params;
//     console.log(
//       "➡️ Requête reçue pour ajouter document",
//       documentId,
//       "dans box",
//       boxId,
//     );

//     const box = await Box.findByPk(boxId);
//     console.log("📦 Box trouvé :", box ? box.toJSON() : "❌ introuvable");

//     const doc = await Document.findByPk(documentId);
//     console.log("📄 Document trouvé :", doc ? doc.toJSON() : "❌ introuvable");

//     if (!box || !doc) {
//       console.warn("⚠️ Box ou Document introuvable");
//       return res.status(404).json({ message: "Box ou Document introuvable" });
//     }

//     // Vérification Capacité
//     if (box.current_count >= box.capacite_max) {
//       console.warn(
//         "⚠️ Capacité maximale atteinte :",
//         box.current_count,
//         "/",
//         box.capacite_max,
//       );
//       return res
//         .status(400)
//         .json({ message: "Capacité maximale atteinte pour ce box" });
//     }

//     // Vérification Type
//     console.log(
//       "🔍 Vérification type : box.type_document_id =",
//       box.type_document_id,
//       "doc.type_document_id =",
//       doc.type_document_id,
//     );
//     if (box.type_document_id && box.type_document_id !== doc.type_document_id) {
//       console.warn("⚠️ Type de document incompatible");
//       return res
//         .status(400)
//         .json({ message: "Le type de document ne correspond pas à ce box" });
//     }

//     // Mise à jour
//     if (!box.type_document_id) {
//       console.log(
//         "ℹ️ Affectation du type_document_id du box :",
//         doc.type_document_id,
//       );
//       box.type_document_id = doc.type_document_id;
//     }
//     box.current_count += 1;
//     doc.box_id = box.id;

//     console.log(
//       "💾 Sauvegarde des modifications : box.current_count =",
//       box.current_count,
//       "doc.box_id =",
//       doc.box_id,
//     );

//     await box.save();
//     await doc.save();

//     console.log("✅ Document ajouté avec succès");
//     res.json({ success: true, current_count: box.current_count });
//   } catch (error) {
//     console.error("❌ Erreur addDocumentToBox:", error);
//     res.status(500).json({
//       message: "Erreur lors de l'ajout du document",
//       error: error.message,
//     });
//   }
// };

exports.retireDocumentToBox = async (req, res) => {
  try {
    const doc = await Document.findByPk(req.params.documentId);
    if (!doc || !doc.box_id)
      return res
        .status(404)
        .json({ message: "Document non trouvé ou déjà hors box" });

    const box = await Box.findByPk(doc.box_id);
    if (box) {
      box.current_count = Math.max(0, box.current_count - 1);
      if (box.current_count === 0) box.type_document_id = null;
      await box.save();
    }

    doc.box_id = null;
    await doc.save();

    res.json({ success: true, message: "Document retiré avec succès" });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors du retrait du document",
      error: error.message,
    });
  }
};

exports.getAllDocumentByBox = async (req, res) => {
  try {
    const data = await Document.findAll({ where: { box_id: req.params.id } });
    res.json(data);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des documents",
      error: error.message,
    });
  }
};
