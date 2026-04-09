const { Division, SousDirection, Section, Fonction } = require("../models");
const logger = require("../config/logger.config");
const HistoriqueService = require("../services/historique.service");

exports.create = async (req, res) => {
  const startTime = Date.now();

  try {
    logger.info("📝 Tentative de création d'une division", {
      userId: req.user?.id,
      body: req.body,
    });

    const { libelle, sous_direction_id } = req.body;

    // Trouver le dernier code
    const last = await Division.findOne({
      order: [["id", "DESC"]],
      attributes: ["code_pieces"],
    });

    let nextNumber = 1;
    if (last && last.code_pieces) {
      const lastNumber = parseInt(last.code_pieces.split("-")[1]);
      nextNumber = lastNumber + 1;
    }
    const paddedNumber = nextNumber.toString().padStart(3, "0");
    const code = `D-${paddedNumber}`;

    const division = await Division.create({
      code,
      libelle,
      sous_direction_id,
    });

    logger.info("✅ Division créée avec succès", {
      divisionId: division.id,
      code: division.code,
      libelle: division.libelle,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });

    await HistoriqueService.logCreate(req, "division", division);

    res.status(201).json(division);
  } catch (err) {
    // ✅ Afficher plus de détails sur l'erreur
    logger.error("❌ Erreur création division:", {
      error: err.message,
      stack: err.stack,
      errors: err.errors, // ← Afficher les erreurs de validation
      body: req.body,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });

    // Message d'erreur plus détaillé
    const errorMessage = err.errors
      ? err.errors.map((e) => e.message).join(", ")
      : err.message;

    res
      .status(500)
      .json({ message: "Erreur création division", error: errorMessage });
  }
};

exports.findAll = async (req, res) => {
  const startTime = Date.now();

  try {
    const divisions = await Division.findAll({
      include: [
        { model: SousDirection, as: "sousDirection" },
        { model: Section, as: "sections" },
      ],
    });

    res.json(divisions);
  } catch (err) {
    logger.error("❌ Erreur récupération divisions:", {
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

exports.findOne = async (req, res) => {
  const startTime = Date.now();
  const { id } = req.params;

  try {
    const division = await Division.findByPk(id, {
      include: [
        { model: SousDirection, as: "sousDirection" },
        { model: Section, as: "sections" },
      ],
    });

    if (!division) {
      return res.status(404).json({ message: "Division non trouvée" });
    }

    res.json(division);
  } catch (err) {
    logger.error("❌ Erreur recherche division:", {
      divisionId: id,
      error: err.message,
      stack: err.stack,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });
    res
      .status(500)
      .json({ message: "Erreur recherche division", error: err.message });
  }
};

exports.update = async (req, res) => {
  const startTime = Date.now();
  const { id } = req.params;

  try {
    const oldDivision = await Division.findByPk(id);
    if (!oldDivision) {
      return res.status(404).json({ message: "Division non trouvée" });
    }

    const oldCopy = oldDivision.toJSON();
    await oldDivision.update(req.body);

    const updated = await Division.findByPk(id);

    await HistoriqueService.logUpdate(req, "division", oldCopy, updated);

    res.json(updated);
  } catch (err) {
    logger.error("❌ Erreur mise à jour division:", {
      divisionId: id,
      error: err.message,
      stack: err.stack,
      body: req.body,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });
    res
      .status(500)
      .json({ message: "Erreur mise à jour division", error: err.message });
  }
};

exports.delete = async (req, res) => {
  const startTime = Date.now();
  const { id } = req.params;

  try {
    const division = await Division.findByPk(id);
    if (!division) {
      return res.status(404).json({ message: "Division non trouvée" });
    }

    await division.destroy();

    await HistoriqueService.logDelete(req, "division", division);

    res.json({ message: "Division supprimée avec succès" });
  } catch (err) {
    logger.error("❌ Erreur suppression division:", {
      divisionId: id,
      error: err.message,
      stack: err.stack,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });
    res
      .status(500)
      .json({ message: "Erreur suppression division", error: err.message });
  }
};

exports.getSections = async (req, res) => {
  const startTime = Date.now();
  const { id } = req.params;

  try {
    const sections = await Section.findAll({
      where: { division_id: id },
    });

    res.json(sections);
  } catch (err) {
    logger.error("❌ Erreur récupération sections:", {
      divisionId: id,
      error: err.message,
      stack: err.stack,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });
    res
      .status(500)
      .json({ message: "Erreur récupération sections", error: err.message });
  }
};

exports.getFunctionsByDivision = async (req, res) => {
  const startTime = Date.now();
  const { id } = req.params;

  try {
    logger.debug("🔍 Récupération des fonctions d'une entité niveau 1", {
      divisionId: id,
      userId: req.user?.id,
    });

    const fonctions = await Fonction.findAll({
      where: { division_id: id },
    });

    logger.info("✅ Fonctions récupérées", {
      divisionId: id,
      count: fonctions.length,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });

    res.json(fonctions);
  } catch (err) {
    logger.error("❌ Erreur getFunctionsByDivision:", {
      divisionId: id,
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
 * Récupérer les divisions d'une sous-direction
 */
exports.getDivisionsBySousDirection = async (req, res) => {
  const startTime = Date.now();
  const { sousDirectionId } = req.params;

  try {
    logger.debug("🔍 Récupération des divisions d'une sous-direction", {
      sousDirectionId,
      userId: req.user?.id,
    });

    // Vérifier si la sous-direction existe
    const sousDirection = await SousDirection.findByPk(sousDirectionId);
    if (!sousDirection) {
      logger.warn("⚠️ Sous-direction non trouvée", {
        sousDirectionId,
        userId: req.user?.id,
      });
      return res.status(404).json({ message: "Sous-direction non trouvée" });
    }

    const divisions = await Division.findAll({
      where: { sous_direction_id: sousDirectionId },
      order: [["libelle", "ASC"]],
    });

    logger.info("✅ Divisions de la sous-direction récupérées", {
      sousDirectionId,
      count: divisions.length,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });

    res.json(divisions);
  } catch (err) {
    logger.error("❌ Erreur getDivisionsBySousDirection:", {
      sousDirectionId,
      error: err.message,
      stack: err.stack,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};
