// controllers/entiteeQuatre.controller.js
const { EntiteeQuatre, EntiteeTrois, Fonction } = require("../models");
const logger = require("../config/logger.config");
const HistoriqueService = require("../services/historique.service");

exports.createEntiteeQuatre = async (req, res) => {
  const startTime = Date.now();

  try {
    logger.info("📝 Tentative de création d'une entité de niveau 4", {
      userId: req.user?.id,
      body: req.body,
    });

    // 1. Trouver le titre utilisé par les autres éléments
    const exemple = await EntiteeQuatre.findOne({ attributes: ["titre"] });
    const titreGlobal = exemple?.titre || "Défaut";

    // 2. Créer l'élément avec le titre récupéré
    const entitee_quatre = await EntiteeQuatre.create({
      ...req.body,
      titre: titreGlobal,
    });

    logger.info("✅ Entité de niveau 4 créée avec succès", {
      entiteeId: entitee_quatre.id,
      libelle: entitee_quatre.libelle,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });

    await HistoriqueService.logCreate(req, "entiteeQuatre", entitee_quatre);

    res.status(201).json(entitee_quatre);
  } catch (err) {
    logger.error("❌ Erreur création entiteeQuatre:", {
      error: err.message,
      stack: err.stack,
      body: req.body,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });
    res.status(500).json({
      message: "Erreur création EntiteeQuatre",
      error: err.message,
    });
  }
};

exports.getAllEntiteeQuatre = async (req, res) => {
  const startTime = Date.now();

  try {
    logger.debug("🔍 Récupération de toutes les entités de niveau 4", {
      userId: req.user?.id,
    });

    const entitee_quatre = await EntiteeQuatre.findAll({
      include: [
        {
          model: EntiteeTrois,
          as: "entitee_trois",
          attributes: ["id", "libelle", "code", "titre"],
        },
      ],
    });

    logger.info("✅ Entités de niveau 4 récupérées", {
      count: entitee_quatre.length,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });

    res.json(entitee_quatre);
  } catch (err) {
    logger.error("❌ Erreur getAllEntiteeQuatre:", {
      error: err.message,
      stack: err.stack,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });
    res.status(500).json({
      message: "Erreur récupération EntiteeQuatre",
      error: err.message,
    });
  }
};

exports.getEntiteeQuatreTitre = async (req, res) => {
  const startTime = Date.now();

  try {
    logger.debug("🔍 Récupération du titre des entités de niveau 4", {
      userId: req.user?.id,
    });

    const entitee = await EntiteeQuatre.findOne({ attributes: ["titre"] });
    if (!entitee) {
      return res.status(404).json({ message: "Aucun titre trouvé" });
    }

    logger.info("✅ Titre récupéré", {
      titre: entitee.titre,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });

    res.json({ titre: entitee.titre });
  } catch (err) {
    logger.error("❌ Erreur getEntiteeQuatreTitre:", {
      error: err.message,
      stack: err.stack,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });
    res.status(500).json({ message: err.message });
  }
};

exports.updateEntiteeQuatreTitre = async (req, res) => {
  const startTime = Date.now();

  try {
    const { titre } = req.body;
    if (!titre) {
      logger.warn("⚠️ Tentative de mise à jour sans titre", {
        userId: req.user?.id,
      });
      return res.status(400).json({ message: "Le champ 'titre' est requis" });
    }

    logger.info("📝 Tentative de mise à jour du titre global", {
      userId: req.user?.id,
      nouveauTitre: titre,
    });

    const oldTitre = await EntiteeQuatre.findOne({ attributes: ["titre"] });
    const oldValue = oldTitre ? oldTitre.titre : null;
    const count = await EntiteeQuatre.count();

    if (count === 0) {
      await EntiteeQuatre.create({
        titre: titre,
        code: "INIT",
        libelle: "Premier élément EntiteeQuatre",
      });

      logger.info("✅ Titre initial créé", {
        titre,
        userId: req.user?.id,
        duration: Date.now() - startTime,
      });

      return res.json({ message: "Titre initial créé", titre });
    }

    await EntiteeQuatre.update({ titre: titre }, { where: {} });

    logger.info("✅ Titre global mis à jour", {
      ancienTitre: oldValue,
      nouveauTitre: titre,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });

    await HistoriqueService.log({
      agent_id: req.user?.id || null,
      action: "update",
      resource: "entiteeQuatre_titre",
      resource_id: null,
      resource_identifier: "titre global",
      description: `Modification du titre global : ${oldValue || "null"} → ${titre}`,
      method: req.method,
      path: req.originalUrl,
      status: 200,
      ip: req.ip,
      user_agent: req.headers["user-agent"],
      old_data: { titre: oldValue },
      new_data: { titre },
      data: { duration: Date.now() - startTime },
    });

    res.json({ message: "Titre mis à jour pour tous les éléments", titre });
  } catch (err) {
    logger.error("❌ Erreur updateEntiteeQuatreTitre:", {
      error: err.message,
      stack: err.stack,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });
    res.status(500).json({ message: err.message });
  }
};

exports.getEntiteeQuatreByEntiteeTrois = async (req, res) => {
  const startTime = Date.now();
  const { entiteeTroisId } = req.params;

  try {
    logger.debug("🔍 Récupération des entités niveau 4 par entité niveau 3", {
      entiteeTroisId,
      userId: req.user?.id,
    });

    const entitee_quatre = await EntiteeQuatre.findAll({
      where: { entitee_trois_id: entiteeTroisId },
    });

    logger.info("✅ Entités niveau 4 récupérées", {
      entiteeTroisId,
      count: entitee_quatre.length,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });

    res.json(entitee_quatre);
  } catch (err) {
    logger.error("❌ Erreur getEntiteeQuatreByEntiteeTrois:", {
      entiteeTroisId,
      error: err.message,
      stack: err.stack,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });
    res.status(500).json({
      message: "Erreur récupération EntiteeQuatre",
      error: err.message,
    });
  }
};

exports.getFunctionsByEntiteeQuatre = async (req, res) => {
  const startTime = Date.now();
  const { id } = req.params;

  try {
    logger.debug("🔍 Récupération des fonctions d'une entité niveau 4", {
      entiteeId: id,
      userId: req.user?.id,
    });

    const fonctions = await Fonction.findAll({
      where: { entitee_quatre_id: id },
    });

    logger.info("✅ Fonctions récupérées", {
      entiteeId: id,
      count: fonctions.length,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });

    res.json(fonctions);
  } catch (err) {
    logger.error("❌ Erreur getFunctionsByEntiteeQuatre:", {
      entiteeId: id,
      error: err.message,
      stack: err.stack,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });
    res.status(500).json({
      message: "Erreur récupération fonctions",
      error: err.message,
    });
  }
};

exports.updateEntiteeQuatre = async (req, res) => {
  const startTime = Date.now();
  const { id } = req.params;

  try {
    logger.info("📝 Tentative de modification d'une entité niveau 4", {
      entiteeId: id,
      userId: req.user?.id,
      body: req.body,
    });

    const oldEntitee = await EntiteeQuatre.findByPk(id);
    if (!oldEntitee) {
      logger.warn("⚠️ Entité niveau 4 non trouvée", {
        entiteeId: id,
        userId: req.user?.id,
      });
      return res.status(404).json({ message: "EntiteeQuatre non trouvé" });
    }

    const oldCopy = oldEntitee.toJSON();
    await oldEntitee.update(req.body);

    const updated = await EntiteeQuatre.findByPk(id, {
      include: [{ model: EntiteeTrois, as: "entitee_trois" }],
    });

    logger.info("✅ Entité niveau 4 modifiée avec succès", {
      entiteeId: id,
      libelle: updated.libelle,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });

    await HistoriqueService.logUpdate(req, "entiteeQuatre", oldCopy, updated);

    res.status(200).json(updated);
  } catch (err) {
    logger.error("❌ Erreur updateEntiteeQuatre:", {
      entiteeId: id,
      error: err.message,
      stack: err.stack,
      body: req.body,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });
    res.status(500).json({
      message: "Erreur mise à jour entitee_quatre",
      error: err.message,
    });
  }
};

exports.deleteEntiteeQuatre = async (req, res) => {
  const startTime = Date.now();
  const { id } = req.params;

  try {
    logger.info("🗑️ Tentative de suppression d'une entité niveau 4", {
      entiteeId: id,
      userId: req.user?.id,
    });

    const ent = await EntiteeQuatre.findByPk(id);
    if (!ent) {
      logger.warn("⚠️ Entité niveau 4 non trouvée pour suppression", {
        entiteeId: id,
        userId: req.user?.id,
      });
      return res.status(404).json({ message: "EntiteeQuatre non trouvé" });
    }

    await ent.destroy();

    logger.info("✅ Entité niveau 4 supprimée avec succès", {
      entiteeId: id,
      libelle: ent.libelle,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });

    await HistoriqueService.logDelete(req, "entiteeQuatre", ent);

    res.status(200).json({ message: "EntiteeQuatre supprimé" });
  } catch (err) {
    logger.error("❌ Erreur deleteEntiteeQuatre:", {
      entiteeId: id,
      error: err.message,
      stack: err.stack,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });
    res.status(500).json({
      message: "Erreur suppression EntiteeQuatre",
      error: err.message,
    });
  }
};
