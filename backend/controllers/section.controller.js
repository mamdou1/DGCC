const { Section, Division, Fonction } = require("../models");
const logger = require("../config/logger.config");
const HistoriqueService = require("../services/historique.service");

exports.create = async (req, res) => {
  const startTime = Date.now();
  try {
    const { libelle, division_id } = req.body;

    // Validation présence
    if (!libelle?.trim()) return res.status(400).json({ message: "Le libellé est requis" });
    if (!division_id || isNaN(division_id)) return res.status(400).json({ message: "division_id requis et doit être un nombre" });

    // Vérifier que la division existe
    const division = await Division.findByPk(division_id);
    if (!division) return res.status(404).json({ message: "Division non trouvée" });

    // Génération du code
    const last = await Section.findOne({ order: [["id", "DESC"]], attributes: ["code"] });
    let nextNumber = 1;
    if (last?.code) {
      const match = last.code.match(/SEC-(\d+)/);
      if (match) nextNumber = parseInt(match[1]) + 1;
    }
    const code = `SEC-${nextNumber.toString().padStart(3, "0")}`;

    const section = await Section.create({ code, libelle: libelle.trim(), division_id });

    logger.info("✅ Section créée", { sectionId: section.id, userId: req.user?.id, duration: Date.now() - startTime });
    await HistoriqueService.logCreate(req, "section", section);
    res.status(201).json(section);
  } catch (err) {
    if (err.name === "SequelizeValidationError") {
      return res.status(400).json({ message: "Erreur validation", details: err.errors.map(e => e.message) });
    }
    logger.error("❌ Erreur création section:", { error: err.message, stack: err.stack, body: req.body });
    res.status(500).json({ message: "Erreur création section", error: err.message });
  }
};

exports.findAll = async (req, res) => {
  const startTime = Date.now();

  try {
    const sections = await Section.findAll({
      include: [{ model: Division, as: "division" }],
    });

    res.json(sections);
  } catch (err) {
    logger.error("❌ Erreur récupération sections:", {
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

exports.findOne = async (req, res) => {
  const startTime = Date.now();
  const { id } = req.params;

  try {
    const section = await Section.findByPk(id, {
      include: [{ model: Division, as: "division" }],
    });

    if (!section) {
      return res.status(404).json({ message: "Section non trouvée" });
    }

    res.json(section);
  } catch (err) {
    logger.error("❌ Erreur recherche section:", {
      sectionId: id,
      error: err.message,
      stack: err.stack,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });
    res
      .status(500)
      .json({ message: "Erreur recherche section", error: err.message });
  }
};

exports.update = async (req, res) => {
  const startTime = Date.now();
  const { id } = req.params;

  try {
    const oldSection = await Section.findByPk(id);
    if (!oldSection) {
      return res.status(404).json({ message: "Section non trouvée" });
    }

    const oldCopy = oldSection.toJSON();
    await oldSection.update(req.body);

    const updated = await Section.findByPk(id);

    await HistoriqueService.logUpdate(req, "section", oldCopy, updated);

    res.json(updated);
  } catch (err) {
    logger.error("❌ Erreur mise à jour section:", {
      sectionId: id,
      error: err.message,
      stack: err.stack,
      body: req.body,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });
    res
      .status(500)
      .json({ message: "Erreur mise à jour section", error: err.message });
  }
};

exports.delete = async (req, res) => {
  const startTime = Date.now();
  const { id } = req.params;

  try {
    const section = await Section.findByPk(id);
    if (!section) {
      return res.status(404).json({ message: "Section non trouvée" });
    }

    await section.destroy();

    await HistoriqueService.logDelete(req, "section", section);

    res.json({ message: "Section supprimée avec succès" });
  } catch (err) {
    logger.error("❌ Erreur suppression section:", {
      sectionId: id,
      error: err.message,
      stack: err.stack,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });
    res
      .status(500)
      .json({ message: "Erreur suppression section", error: err.message });
  }
};

exports.getFunctionsBySection = async (req, res) => {
  const startTime = Date.now();
  const { id } = req.params;

  try {
    logger.debug("🔍 Récupération des fonctions d'une entité niveau 1", {
      sectionId: id,
      userId: req.user?.id,
    });

    const fonctions = await Fonction.findAll({
      where: { section_id: id },
    });

    logger.info("✅ Fonctions récupérées", {
      sectionId: id,
      count: fonctions.length,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });

    res.json(fonctions);
  } catch (err) {
    logger.error("❌ Erreur getFunctionsBySection:", {
      sectionId: id,
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
 * Récupérer les sections d'une division
 */
exports.getSectionsByDivision = async (req, res) => {
  const startTime = Date.now();
  const { divisionId } = req.params;

  try {
    logger.debug("🔍 Récupération des sections d'une division", {
      divisionId,
      userId: req.user?.id,
    });

    // Vérifier si la division existe
    const division = await Division.findByPk(divisionId);
    if (!division) {
      logger.warn("⚠️ Division non trouvée", {
        divisionId,
        userId: req.user?.id,
      });
      return res.status(404).json({ message: "Division non trouvée" });
    }

    const sections = await Section.findAll({
      where: { division_id: divisionId },
      order: [["libelle", "ASC"]],
    });

    logger.info("✅ Sections de la division récupérées", {
      divisionId,
      count: sections.length,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });

    res.json(sections);
  } catch (err) {
    logger.error("❌ Erreur getSectionsByDivision:", {
      divisionId,
      error: err.message,
      stack: err.stack,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};
