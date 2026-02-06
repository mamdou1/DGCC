const {
  TypeDocument,
  MetaField,
  Pieces,
  EntiteeUn,
  EntiteeDeux,
  EntiteeTrois,
  sequelize,
} = require("../models");
const buildAccessWhere = require("../utils/buildAccessWhere.utils");

exports.create = async (req, res) => {
  try {
    req.body;

    const payload = req.body;

    const data = await TypeDocument.create(payload);

    res.status(201).json(data);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.update = async (req, res) => {
  try {
    // 1. Extraire uniquement les champs scalaires (pas les objets/tableaux)
    // Assurez-vous d'utiliser les noms exacts de vos colonnes en BD
    const {
      nom,
      code,
      entitee_un_id,
      entitee_deux_id,
      entitee_trois_id,
      division_id,
    } = req.body;

    const [updated] = await TypeDocument.update(
      {
        nom,
        code,
        entitee_un_id,
        entitee_deux_id,
        entitee_trois_id,
        division_id,
      },
      { where: { id: req.params.id } },
    );

    if (updated === 0) {
      return res.status(404).json({
        message:
          "Aucun document trouvé avec cet ID ou aucune modification apportée",
      });
    }

    res.json({ success: true, message: "Mise à jour réussie" });
  } catch (e) {
    console.error("Erreur Update:", e);
    res.status(500).json({ message: e.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const data = await TypeDocument.findAll({
      include: [
        { model: MetaField, as: "metaFields" },
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
    // Dans ton controller TypeDocument.getAll
    const formatted = data.map((td) => {
      // Logique pour trouver l'entité la plus précise rattachée
      const entiteeConcernee =
        td.entitee_trois || td.entitee_deux || td.entitee_un || td.division; // Fallback sur division si les autres sont nulles

      return {
        id: td.id,
        code: td.code,
        nom: td.nom,
        // On ajoute ce champ pour simplifier le travail du frontend
        structure_libelle: entiteeConcernee
          ? entiteeConcernee.libelle
          : "Non assigné",
        // On garde les objets complets au cas où
        entitee_un: td.entitee_un,
        entitee_deux: td.entitee_deux,
        entitee_trois: td.entitee_trois,
        division: td.division,
        metaFields: td.metaFields || [],
        pieces: (td.pieces || []).map((p) => ({
          id: p.id,
          libelle: p.libelle,
          code_pieces: p.code_pieces,
        })),
        createdAt: td.createdAt,
        updatedAt: td.updatedAt,
      };
    });

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
