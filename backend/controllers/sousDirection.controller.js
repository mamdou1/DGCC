const { SousDirection, Direction, Division, Fonction } = require("../models");
const logger = require("../config/logger.config");
const HistoriqueService = require("../services/historique.service");

exports.create = async (req, res) => {
  const startTime = Date.now();
  try {
    const { libelle, direction_id } = req.body;

    if (!libelle?.trim()) return res.status(400).json({ message: "Le libellé est requis" });
    if (!direction_id || isNaN(direction_id)) return res.status(400).json({ message: "direction_id requis" });

    const direction = await Direction.findByPk(direction_id);
    if (!direction) return res.status(404).json({ message: "Direction non trouvée" });

    const last = await SousDirection.findOne({ order: [["id", "DESC"]], attributes: ["code"] });
    let nextNumber = 1;
    if (last?.code) {
      const match = last.code.match(/SD-(\d+)/);
      if (match) nextNumber = parseInt(match[1]) + 1;
    }
    const code = `SD-${nextNumber.toString().padStart(3, "0")}`;

    const sousDirection = await SousDirection.create({ code, libelle: libelle.trim(), direction_id });

    logger.info("✅ Sous-direction créée", { sousDirectionId: sousDirection.id, userId: req.user?.id, duration: Date.now() - startTime });
    await HistoriqueService.logCreate(req, "sousDirection", sousDirection);
    res.status(201).json(sousDirection);
  } catch (err) {
    if (err.name === "SequelizeValidationError") {
      return res.status(400).json({ message: "Erreur validation", details: err.errors.map(e => e.message) });
    }
    logger.error("❌ Erreur création sous-direction:", { error: err.message, stack: err.stack, body: req.body });
    res.status(500).json({ message: "Erreur création sous-direction", error: err.message });
  }
};

exports.findAll = async (req, res) => {
  const startTime = Date.now();

  try {
    const sousDirections = await SousDirection.findAll({
      include: [
        { model: Direction, as: "direction" },
        { model: Division, as: "divisions" },
      ],
    });

    res.json(sousDirections);
  } catch (err) {
    logger.error("❌ Erreur récupération sous-directions:", {
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

exports.findOne = async (req, res) => {
  const startTime = Date.now();
  const { id } = req.params;

  try {
    const sousDirection = await SousDirection.findByPk(id, {
      include: [
        { model: Direction, as: "direction" },
        { model: Division, as: "divisions" },
      ],
    });

    if (!sousDirection) {
      return res.status(404).json({ message: "Sous-direction non trouvée" });
    }

    res.json(sousDirection);
  } catch (err) {
    logger.error("❌ Erreur recherche sous-direction:", {
      sousDirectionId: id,
      error: err.message,
      stack: err.stack,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });
    res
      .status(500)
      .json({ message: "Erreur recherche sous-direction", error: err.message });
  }
};

exports.update = async (req, res) => {
  const startTime = Date.now();
  const { id } = req.params;

  try {
    const oldSousDirection = await SousDirection.findByPk(id);
    if (!oldSousDirection) {
      return res.status(404).json({ message: "Sous-direction non trouvée" });
    }

    const oldCopy = oldSousDirection.toJSON();
    await oldSousDirection.update(req.body);

    const updated = await SousDirection.findByPk(id);

    await HistoriqueService.logUpdate(req, "sousDirection", oldCopy, updated);

    res.json(updated);
  } catch (err) {
    logger.error("❌ Erreur mise à jour sous-direction:", {
      sousDirectionId: id,
      error: err.message,
      stack: err.stack,
      body: req.body,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });
    res.status(500).json({
      message: "Erreur mise à jour sous-direction",
      error: err.message,
    });
  }
};

exports.delete = async (req, res) => {
  const startTime = Date.now();
  const { id } = req.params;

  try {
    const sousDirection = await SousDirection.findByPk(id);
    if (!sousDirection) {
      return res.status(404).json({ message: "Sous-direction non trouvée" });
    }

    await sousDirection.destroy();

    await HistoriqueService.logDelete(req, "sousDirection", sousDirection);

    res.json({ message: "Sous-direction supprimée avec succès" });
  } catch (err) {
    logger.error("❌ Erreur suppression sous-direction:", {
      sousDirectionId: id,
      error: err.message,
      stack: err.stack,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });
    res.status(500).json({
      message: "Erreur suppression sous-direction",
      error: err.message,
    });
  }
};

exports.getDivisions = async (req, res) => {
  const startTime = Date.now();
  const { id } = req.params;

  try {
    const divisions = await Division.findAll({
      where: { sous_direction_id: id },
    });

    res.json(divisions);
  } catch (err) {
    logger.error("❌ Erreur récupération divisions:", {
      sousDirectionId: id,
      error: err.message,
      stack: err.stack,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });
    res
      .status(500)
      .json({ message: "Erreur récupération divisions", error: err.message });
  }
};

exports.getFunctionsBySousDirection = async (req, res) => {
  const startTime = Date.now();
  const { id } = req.params;

  try {
    logger.debug("🔍 Récupération des fonctions d'une entité niveau 1", {
      SousdirectionId: id,
      userId: req.user?.id,
    });

    const fonctions = await Fonction.findAll({
      where: { sous_direction_id: id },
    });

    logger.info("✅ Fonctions récupérées", {
      SousdirectionId: id,
      count: fonctions.length,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });

    res.json(fonctions);
  } catch (err) {
    logger.error("❌ Erreur getFunctionsBySousDirection:", {
      SousdirectionId: id,
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

/**
 * Récupérer les sous-directions d'une direction
 */
exports.getSousDirectionsByDirection = async (req, res) => {
  const startTime = Date.now();
  const { directionId } = req.params;

  try {
    logger.debug("🔍 Récupération des sous-directions d'une direction", {
      directionId,
      userId: req.user?.id,
    });

    // Vérifier si la direction existe
    const direction = await Direction.findByPk(directionId);
    if (!direction) {
      logger.warn("⚠️ Direction non trouvée", {
        directionId,
        userId: req.user?.id,
      });
      return res.status(404).json({ message: "Direction non trouvée" });
    }

    const sousDirections = await SousDirection.findAll({
      where: { direction_id: directionId },
      order: [["libelle", "ASC"]],
    });

    logger.info("✅ Sous-directions de la direction récupérées", {
      directionId,
      count: sousDirections.length,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });

    res.json(sousDirections);
  } catch (err) {
    logger.error("❌ Erreur getSousDirectionsByDirection:", {
      directionId,
      error: err.message,
      stack: err.stack,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};
