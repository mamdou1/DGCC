// controllers/typeDocument.controller.js
const {
  TypeDocument,
  MetaField,
  Pieces,
  Direction,
  SousDirection,
  Service,
  Division,
  Section,
  sequelize,
} = require("../models");
const logger = require("../config/logger.config");
const HistoriqueService = require("../services/historique.service");

exports.create = async (req, res) => {
  const startTime = Date.now();

  try {
    logger.info("📝 Tentative de création d'un type de document", {
      userId: req.user?.id,
      body: req.body,
    });

    const {
      nom,
      section_id,
      division_id,
      sous_direction_id,
      service_id,
      direction_id,
    } = req.body;

    const count = await TypeDocument.count();

    const nextNumber = count + 1;
    const paddedNumber = nextNumber.toString().padStart(3, "0");
    const code = `TD-${paddedNumber}`;

    const data = await TypeDocument.create({
      code,
      nom,
      section_id,
      division_id,
      sous_direction_id,
      service_id,
      direction_id,
    });

    logger.info("✅ Type de document créé avec succès", {
      typeId: data.id,
      nom: data.nom,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });

    // Journalisation dans l'historique
    await HistoriqueService.logCreate(req, "typeDocument", data);

    res.status(201).json(data);
  } catch (e) {
    logger.error("❌ Erreur création typeDocument:", {
      error: e.message,
      stack: e.stack,
      body: req.body,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });
    res.status(500).json({ message: e.message });
  }
};

exports.update = async (req, res) => {
  const startTime = Date.now();
  const { id } = req.params;

  try {
    logger.info("📝 Tentative de mise à jour d'un type de document", {
      typeId: id,
      userId: req.user?.id,
      body: req.body,
    });

    const oldType = await TypeDocument.findByPk(id);
    if (!oldType) {
      logger.warn("⚠️ Type de document non trouvé", {
        typeId: id,
        userId: req.user?.id,
      });
      return res.status(404).json({ message: "Type de document non trouvé" });
    }

    const oldCopy = oldType.toJSON();

    // ✅ Extraire TOUS les champs possibles
    const {
      nom,
      code,
      // Anciennes entités
      entitee_un_id,
      entitee_deux_id,
      entitee_trois_id,
      // NOUVELLES ENTITÉS
      direction_id,
      service_id,
      sous_direction_id,
      division_id,
      section_id,
    } = req.body;

    // ✅ Mettre à jour avec TOUS les champs
    const [updated] = await TypeDocument.update(
      {
        nom,
        code,
        // Anciennes entités
        entitee_un_id,
        entitee_deux_id,
        entitee_trois_id,
        // NOUVELLES ENTITÉS
        direction_id,
        service_id,
        sous_direction_id,
        division_id,
        section_id,
      },
      { where: { id } },
    );

    if (updated === 0) {
      logger.warn("⚠️ Aucune modification apportée", {
        typeId: id,
        userId: req.user?.id,
      });
      return res.status(404).json({
        message: "Aucune modification apportée",
      });
    }

    const updatedType = await TypeDocument.findByPk(id);

    logger.info("✅ Type de document mis à jour avec succès", {
      typeId: id,
      nom: updatedType.nom,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });

    await HistoriqueService.logUpdate(
      req,
      "typeDocument",
      oldCopy,
      updatedType,
    );

    res.json({
      success: true,
      message: "Mise à jour réussie",
      data: updatedType,
    });
  } catch (e) {
    logger.error("❌ Erreur mise à jour typeDocument:", {
      typeId: id,
      error: e.message,
      stack: e.stack,
      body: req.body,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });
    res.status(500).json({ message: e.message });
  }
};

exports.getAll = async (req, res) => {
  const startTime = Date.now();

  try {
    logger.debug("🔍 Récupération de tous les types de documents", {
      userId: req.user?.id,
      query: req.query,
    });

    const data = await TypeDocument.findAll({
      include: [
        { model: MetaField, as: "metaFields" },
        {
          model: Direction,
          as: "direction",
          attributes: ["id", "libelle", "code"],
        },
        {
          model: SousDirection,
          as: "sousDirection",
          attributes: ["id", "libelle", "code"],
        },
        {
          model: Division,
          as: "division",
          attributes: ["id", "libelle", "code"],
        },
        {
          model: Section,
          as: "section",
          attributes: ["id", "libelle", "code"],
        },
        {
          model: Service,
          as: "service",
          attributes: ["id", "libelle", "code"],
        },
        {
          model: Pieces,
          as: "pieces",
          attributes: ["id", "libelle", "code_pieces"],
          through: { attributes: [] },
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    const formatted = data.map((td) => {
      // Déterminer l'entité concernée (priorité aux nouvelles)
      const entiteeConcernee =
        td.section ||
        td.division ||
        td.sousDirection ||
        td.service ||
        td.direction ||
        td.entitee_trois ||
        td.entitee_deux ||
        td.entitee_un;

      return {
        id: td.id,
        code: td.code,
        nom: td.nom,

        // Anciens IDs (pour compatibilité)
        entitee_un_id: td.entitee_un?.id || null,
        entitee_deux_id: td.entitee_deux?.id || null,
        entitee_trois_id: td.entitee_trois?.id || null,

        // ✅ NOUVEAUX IDs
        direction_id: td.direction?.id || null,
        service_id: td.service?.id || null,
        sous_direction_id: td.sousDirection?.id || null,
        division_id: td.division?.id || null,
        section_id: td.section?.id || null,

        structure_libelle: entiteeConcernee
          ? entiteeConcernee.libelle
          : "Non assigné",

        // Anciens objets (pour compatibilité)
        entitee_un: td.entitee_un,
        entitee_deux: td.entitee_deux,
        entitee_trois: td.entitee_trois,

        // ✅ NOUVEAUX OBJETS
        direction: td.direction,
        service: td.service,
        sousDirection: td.sousDirection,
        division: td.division,
        section: td.section,

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

    logger.info("✅ Types de documents récupérés", {
      count: formatted.length,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });

    res.json({ typeDocument: formatted });
  } catch (e) {
    logger.error("❌ Erreur getAll typeDocument:", {
      error: e.message,
      stack: e.stack,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });
    res.status(500).json({ message: e.message });
  }
};

exports.getById = async (req, res) => {
  const startTime = Date.now();
  const { id } = req.params;

  try {
    logger.debug("🔍 Recherche d'un type de document par ID", {
      typeId: id,
      userId: req.user?.id,
    });

    const data = await TypeDocument.findByPk(id, {
      include: [
        { model: Direction },
        { model: SousDirection },
        { model: Division },
        { model: Section },
        { model: Service },
        { model: MetaField },
      ],
    });

    if (!data) {
      logger.warn("⚠️ Type de document non trouvé", {
        typeId: id,
        userId: req.user?.id,
      });
      return res.status(404).json({ message: "Not found" });
    }

    logger.info("✅ Type de document trouvé", {
      typeId: id,
      nom: data.nom,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });

    // Journalisation dans l'historique
    await HistoriqueService.log({
      agent_id: req.user?.id || null,
      action: "read",
      resource: "typeDocument",
      resource_id: data.id,
      resource_identifier: `${data.nom} (${data.id})`,
      description: `Consultation du type de document #${data.id}`,
      method: req.method,
      path: req.originalUrl,
      status: 200,
      ip: req.ip,
      user_agent: req.headers["user-agent"],
      data: {
        duration: Date.now() - startTime,
      },
    });

    res.json(data);
  } catch (e) {
    logger.error("❌ Erreur getById typeDocument:", {
      typeId: id,
      error: e.message,
      stack: e.stack,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });
    res.status(500).json({ message: e.message });
  }
};

exports.remove = async (req, res) => {
  const startTime = Date.now();
  const { id } = req.params;

  try {
    logger.info("🗑️ Tentative de suppression d'un type de document", {
      typeId: id,
      userId: req.user?.id,
    });

    const typeDoc = await TypeDocument.findByPk(id);
    if (!typeDoc) {
      logger.warn("⚠️ Type de document non trouvé pour suppression", {
        typeId: id,
        userId: req.user?.id,
      });
      return res.status(404).json({ message: "Type de document non trouvé" });
    }

    await TypeDocument.destroy({ where: { id } });

    logger.info("✅ Type de document supprimé avec succès", {
      typeId: id,
      nom: typeDoc.nom,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });

    // Journalisation dans l'historique
    await HistoriqueService.logDelete(req, "typeDocument", typeDoc);

    res.json({ success: true });
  } catch (e) {
    logger.error("❌ Erreur suppression typeDocument:", {
      typeId: id,
      error: e.message,
      stack: e.stack,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });
    res.status(500).json({ message: e.message });
  }
};

exports.addPiecesToTypeDocument = async (req, res) => {
  const startTime = Date.now();
  const t = await sequelize.transaction();

  try {
    const { id } = req.params;
    const { pieces } = req.body;

    logger.info("📝 Tentative d'ajout de pièces à un type de document", {
      typeId: id,
      piecesCount: pieces.length,
      userId: req.user?.id,
    });

    const typeDocument = await TypeDocument.findByPk(id);
    if (!typeDocument) {
      logger.warn("⚠️ Type de document non trouvé", {
        typeId: id,
        userId: req.user?.id,
      });
      return res.status(404).json({ message: "Type de document introuvable" });
    }

    for (const p of pieces) {
      await typeDocument.addPiece(p.piece, {
        through: {
          disponible: p.disponible ?? false,
        },
        transaction: t,
      });
    }

    await t.commit();

    logger.info("✅ Pièces ajoutées au type de document", {
      typeId: id,
      piecesCount: pieces.length,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });

    // Journalisation dans l'historique
    await HistoriqueService.log({
      agent_id: req.user?.id || null,
      action: "update",
      resource: "typeDocument_pieces",
      resource_id: id,
      resource_identifier: `${typeDocument.nom} (${id})`,
      description: `Ajout de ${pieces.length} pièce(s) au type de document`,
      method: req.method,
      path: req.originalUrl,
      status: 200,
      ip: req.ip,
      user_agent: req.headers["user-agent"],
      data: {
        piecesCount: pieces.length,
        duration: Date.now() - startTime,
      },
    });

    res.json({ message: "Pièces ajoutées avec succès" });
  } catch (err) {
    if (t) await t.rollback();
    logger.error("❌ Erreur addPiecesToTypeDocument:", {
      typeId: id,
      error: err.message,
      stack: err.stack,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });
    res.status(500).json({ message: err.message });
  }
};

exports.removePieceFromTypeDocument = async (req, res) => {
  const startTime = Date.now();
  const { id } = req.params;
  const { pieceId } = req.body;

  try {
    logger.info("🗑️ Tentative de retrait d'une pièce d'un type de document", {
      typeId: id,
      pieceId,
      userId: req.user?.id,
    });

    const typeDocument = await TypeDocument.findByPk(id);
    if (!typeDocument) {
      logger.warn("⚠️ Type de document non trouvé", {
        typeId: id,
        userId: req.user?.id,
      });
      return res.status(404).json({ message: "Type de document introuvable" });
    }

    await typeDocument.removePiece(pieceId);

    logger.info("✅ Pièce retirée du type de document", {
      typeId: id,
      pieceId,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });

    // Journalisation dans l'historique
    await HistoriqueService.log({
      agent_id: req.user?.id || null,
      action: "update",
      resource: "typeDocument_pieces",
      resource_id: id,
      resource_identifier: `${typeDocument.nom} (${id})`,
      description: `Retrait d'une pièce du type de document`,
      method: req.method,
      path: req.originalUrl,
      status: 200,
      ip: req.ip,
      user_agent: req.headers["user-agent"],
      data: {
        pieceId,
        duration: Date.now() - startTime,
      },
    });

    res.json({ message: "Pièce supprimée avec succès" });
  } catch (err) {
    logger.error("❌ Erreur removePieceFromTypeDocument:", {
      typeId: id,
      pieceId,
      error: err.message,
      stack: err.stack,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });
    res.status(500).json({ message: err.message });
  }
};

exports.getPiecesOfTypeDocument = async (req, res) => {
  const startTime = Date.now();
  const { id } = req.params;

  try {
    logger.debug("🔍 Récupération des pièces d'un type de document", {
      typeId: id,
      userId: req.user?.id,
    });

    const typeDocument = await TypeDocument.findByPk(id, {
      include: [
        {
          model: Pieces,
          as: "pieces",
          attributes: ["id", "libelle", "code_pieces"],
        },
      ],
    });

    if (!typeDocument) {
      logger.warn("⚠️ Type de document non trouvé", {
        typeId: id,
        userId: req.user?.id,
      });
      return res.status(404).json({ message: "Type de document introuvable" });
    }

    logger.info("✅ Pièces du type de document récupérées", {
      typeId: id,
      count: typeDocument.pieces?.length || 0,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });

    res.json(typeDocument.pieces);
  } catch (err) {
    logger.error("❌ Erreur getPiecesOfTypeDocument:", {
      typeId: id,
      error: err.message,
      stack: err.stack,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });
    res.status(500).json({ message: err.message });
  }
};
