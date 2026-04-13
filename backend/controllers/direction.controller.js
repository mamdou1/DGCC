const {
  Direction,
  SousDirection,
  Fonction,
  TypeDocument,
} = require("../models");
const logger = require("../config/logger.config");
const HistoriqueService = require("../services/historique.service");

exports.create = async (req, res) => {
  const startTime = Date.now();
  try {
    logger.info("📝 Tentative de création d'une direction", { userId: req.user?.id, body: req.body });

    const { code, libelle } = req.body;

    // Validation manuelle
    if (!code || !code.trim()) {
      return res.status(400).json({ message: "Le code est requis" });
    }
    if (!libelle || !libelle.trim()) {
      return res.status(400).json({ message: "Le libellé est requis" });
    }

    // Vérifier l'unicité du code (optionnel, le modèle le fait déjà)
    const existing = await Direction.findOne({ where: { code } });
    if (existing) {
      return res.status(409).json({ message: "Ce code direction existe déjà" });
    }

    const direction = await Direction.create({ code, libelle });

    logger.info("✅ Direction créée", { directionId: direction.id, userId: req.user?.id, duration: Date.now() - startTime });
    await HistoriqueService.logCreate(req, "direction", direction);
    res.status(201).json(direction);
  } catch (err) {
    if (err.name === "SequelizeValidationError") {
      return res.status(400).json({ message: "Erreur de validation", details: err.errors.map(e => e.message) });
    }
    if (err.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({ message: "Ce code direction existe déjà" });
    }
    logger.error("❌ Erreur création direction:", { error: err.message, stack: err.stack, body: req.body });
    res.status(500).json({ message: "Erreur création direction", error: err.message });
  }
};

exports.findAll = async (req, res) => {
  const startTime = Date.now();

  try {
    const directions = await Direction.findAll({
      include: [{ model: SousDirection, as: "sousDirections" }],
    });

    res.json(directions);
  } catch (err) {
    logger.error("❌ Erreur récupération directions:", {
      error: err.message,
      stack: err.stack,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });
    res
      .status(500)
      .json({ message: "Erreur récupération directions", error: err.message });
  }
};

exports.findOne = async (req, res) => {
  const startTime = Date.now();
  const { id } = req.params;

  try {
    const direction = await Direction.findByPk(id, {
      include: [{ model: SousDirection, as: "sousDirections" }],
    });

    if (!direction) {
      return res.status(404).json({ message: "Direction non trouvée" });
    }

    res.json(direction);
  } catch (err) {
    logger.error("❌ Erreur recherche direction:", {
      directionId: id,
      error: err.message,
      stack: err.stack,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });
    res
      .status(500)
      .json({ message: "Erreur recherche direction", error: err.message });
  }
};

exports.update = async (req, res) => {
  const startTime = Date.now();
  const { id } = req.params;

  try {
    const oldDirection = await Direction.findByPk(id);
    if (!oldDirection) {
      return res.status(404).json({ message: "Direction non trouvée" });
    }

    const oldCopy = oldDirection.toJSON();
    await oldDirection.update(req.body);

    const updated = await Direction.findByPk(id);

    await HistoriqueService.logUpdate(req, "direction", oldCopy, updated);

    res.json(updated);
  } catch (err) {
    logger.error("❌ Erreur mise à jour direction:", {
      directionId: id,
      error: err.message,
      stack: err.stack,
      body: req.body,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });
    res
      .status(500)
      .json({ message: "Erreur mise à jour direction", error: err.message });
  }
};

exports.delete = async (req, res) => {
  const startTime = Date.now();
  const { id } = req.params;

  try {
    const direction = await Direction.findByPk(id);
    if (!direction) {
      return res.status(404).json({ message: "Direction non trouvée" });
    }

    await direction.destroy();

    await HistoriqueService.logDelete(req, "direction", direction);

    res.json({ message: "Direction supprimée avec succès" });
  } catch (err) {
    logger.error("❌ Erreur suppression direction:", {
      directionId: id,
      error: err.message,
      stack: err.stack,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });
    res
      .status(500)
      .json({ message: "Erreur suppression direction", error: err.message });
  }
};

exports.getSousDirections = async (req, res) => {
  const startTime = Date.now();
  const { id } = req.params;

  try {
    const sousDirections = await SousDirection.findAll({
      where: { direction_id: id },
    });

    res.json(sousDirections);
  } catch (err) {
    logger.error("❌ Erreur récupération sous-directions:", {
      directionId: id,
      error: err.message,
      stack: err.stack,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });
    res.status(500).json({
      message: "Erreur récupération sous-directions",
      error: err.message,
    });
  }
};

exports.getFunctionsByDirection = async (req, res) => {
  const startTime = Date.now();
  const { id } = req.params;

  try {
    logger.debug("🔍 Récupération des fonctions d'une entité niveau 1", {
      directionId: id,
      userId: req.user?.id,
    });

    const fonctions = await Fonction.findAll({
      where: { direction_id: id },
    });

    logger.info("✅ Fonctions récupérées", {
      directionId: id,
      count: fonctions.length,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });

    res.json(fonctions);
  } catch (err) {
    logger.error("❌ Erreur getFunctionsByDirection:", {
      directionId: id,
      error: err.message,
      stack: err.stack,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });
    res
      .status(500)
      .json({ message: "Erreur récupération fonctions", error: err.message });
  }
};
