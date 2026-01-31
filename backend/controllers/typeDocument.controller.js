const {
  TypeDocument,
  MetaField,
  Division,
  Document,
  Pieces,
  EntiteeUn,
  EntiteeDeux,
  EntiteeTrois,
  sequelize,
} = require("../models");

exports.create = async (req, res) => {
  try {
    const {
      code,
      nom,
      division_id,
      entitee_un_id,
      entitee_deux_id,
      entitee_trois_id,
    } = req.body;
    const data = await TypeDocument.create({
      code,
      nom,
      division_id,
      entitee_un_id,
      entitee_deux_id,
      entitee_trois_id,
    });
    res.json(data);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const data = await TypeDocument.findAll({
      include: [
        { model: MetaField, as: "metaFields" },
        {
          model: Division,
          as: "division",
          attributes: ["id", "libelle"],
        },
        {
          model: EntiteeUn,
          as: "entitee_un",
          attributes: ["id", "libelle"],
        },
        {
          model: EntiteeDeux,
          as: "entitee_deux",
          attributes: ["id", "libelle"],
        },
        {
          model: EntiteeTrois,
          as: "entitee_trois",
          attributes: ["id", "libelle"],
        },
        {
          model: Pieces,
          as: "pieces", // L'alias défini dans votre association belongsToMany
          attributes: ["id", "libelle", "code_pieces"],
          through: { attributes: [] }, // On ne veut pas les colonnes de la table pivot ici
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    // Formatage identique à votre ancien modèle
    const formatted = data.map((td) => ({
      id: td.id,
      code: td.code,
      nom: td.nom,
      division: td.division
        ? {
            id: td.division.id,
            libelle: td.division.libelle,
          }
        : null,
      entitee_un: td.entitee_un
        ? {
            id: td.entitee_un.id,
            libelle: td.entitee_un.libelle,
          }
        : null,
      entitee_deux: td.entitee_deux
        ? {
            id: td.entitee_deux.id,
            libelle: td.entitee_deux.libelle,
          }
        : null,
      entitee_trois: td.entitee_trois
        ? {
            id: td.entitee_trois.id,
            libelle: td.entitee_trois.libelle,
          }
        : null,
      metaFields: td.metaFields || [],
      // On mappe les pièces pour qu'elles soient facilement accessibles au front
      pieces: (td.pieces || []).map((p) => ({
        id: p.id,
        libelle: p.libelle,
        code_pieces: p.code_pieces,
      })),
      createdAt: td.createdAt,
      updatedAt: td.updatedAt,
    }));

    res.json({ typeDocument: formatted }); // On renvoie un objet avec la clé typeDocument
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const data = await TypeDocument.findByPk(req.params.id, {
      include: [
        { model: EntiteeUn },
        { model: EntiteeDeux },
        { model: EntiteeTrois },
        { model: Division },
        { model: MetaField },
      ],
    });

    if (!data) return res.status(404).json({ message: "Not found" });
    res.json(data);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.update = async (req, res) => {
  try {
    await TypeDocument.update(req.body, { where: { id: req.params.id } });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await TypeDocument.destroy({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.addPiecesToTypeDocument = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { id } = req.params;
    const { pieces } = req.body;

    const typeDocument = await TypeDocument.findByPk(id);
    if (!typeDocument)
      return res.status(404).json({ message: "Type de document introuvable" });

    for (const p of pieces) {
      await typeDocument.addPiece(p.piece, {
        through: {
          disponible: p.disponible ?? false,
          //fichier: null,
        },
        transaction: t,
      });
    }

    await t.commit();
    res.json({ message: "Pièces ajoutées avec succès" });
  } catch (err) {
    await t.rollback();
    res.status(500).json({ message: err.message });
  }
};
