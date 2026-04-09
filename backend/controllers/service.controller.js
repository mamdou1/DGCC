// controllers/service.controller.js
const { Service, Direction, Fonction, TypeDocument } = require("../models");
const logger = require("../config/logger.config");
const HistoriqueService = require("../services/historique.service");

/**
 * Créer un nouveau service
 */
exports.create = async (req, res) => {
  const startTime = Date.now();

  try {
    logger.info("📝 Tentative de création d'un service", {
      userId: req.user?.id,
      body: req.body,
    });

    // Vérifier si la direction existe
    if (req.body.direction_id) {
      const direction = await Direction.findByPk(req.body.direction_id);
      if (!direction) {
        logger.warn("⚠️ Direction non trouvée", {
          directionId: req.body.direction_id,
          userId: req.user?.id,
        });
        return res.status(404).json({ message: "Direction non trouvée" });
      }
    }

    const { libelle, direction_id } = req.body;
    // Trouver le dernier code
    const last = await Service.findOne({
      order: [["id", "DESC"]],
      attributes: ["code_pieces"],
    });

    let nextNumber = 1;
    if (last && last.code_pieces) {
      const lastNumber = parseInt(last.code_pieces.split("-")[1]);
      nextNumber = lastNumber + 1;
    }

    const paddedNumber = nextNumber.toString().padStart(3, "0");

    const code = `SERV-${paddedNumber}`;

    const service = await Service.create({
      code,
      libelle,
      direction_id,
    });

    logger.info("✅ Service créé avec succès", {
      serviceId: service.id,
      code: service.code,
      libelle: service.libelle,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });

    await HistoriqueService.logCreate(req, "service", service);

    res.status(201).json(service);
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      logger.warn("⚠️ Code déjà existant", {
        code: req.body.code,
        userId: req.user?.id,
      });
      return res.status(400).json({ message: "Ce code existe déjà" });
    }

    logger.error("❌ Erreur création service:", {
      error: err.message,
      stack: err.stack,
      body: req.body,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });
    res
      .status(500)
      .json({ message: "Erreur création service", error: err.message });
  }
};

/**
 * Récupérer tous les services
 */
exports.findAll = async (req, res) => {
  const startTime = Date.now();

  try {
    logger.debug("🔍 Récupération de tous les services", {
      userId: req.user?.id,
    });

    const services = await Service.findAll({
      include: [
        {
          model: Direction,
          as: "direction",
          attributes: ["id", "code", "libelle"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    logger.info("✅ Services récupérés", {
      count: services.length,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });

    res.json(services);
  } catch (err) {
    logger.error("❌ Erreur récupération services:", {
      error: err.message,
      stack: err.stack,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });
    res
      .status(500)
      .json({ message: "Erreur récupération services", error: err.message });
  }
};

/**
 * Récupérer un service par son ID
 */
exports.findOne = async (req, res) => {
  const startTime = Date.now();
  const { id } = req.params;

  try {
    logger.debug("🔍 Recherche d'un service par ID", {
      serviceId: id,
      userId: req.user?.id,
    });

    const service = await Service.findByPk(id, {
      include: [
        {
          model: Direction,
          as: "direction",
          attributes: ["id", "code", "libelle"],
        },
      ],
    });

    if (!service) {
      logger.warn("⚠️ Service non trouvé", {
        serviceId: id,
        userId: req.user?.id,
      });
      return res.status(404).json({ message: "Service non trouvé" });
    }

    logger.info("✅ Service trouvé", {
      serviceId: id,
      code: service.code,
      libelle: service.libelle,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });

    res.json(service);
  } catch (err) {
    logger.error("❌ Erreur recherche service:", {
      serviceId: id,
      error: err.message,
      stack: err.stack,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });
    res
      .status(500)
      .json({ message: "Erreur recherche service", error: err.message });
  }
};

/**
 * Mettre à jour un service
 */
exports.update = async (req, res) => {
  const startTime = Date.now();
  const { id } = req.params;

  try {
    logger.info("📝 Tentative de mise à jour d'un service", {
      serviceId: id,
      userId: req.user?.id,
      body: req.body,
    });

    const oldService = await Service.findByPk(id);
    if (!oldService) {
      logger.warn("⚠️ Service non trouvé pour mise à jour", {
        serviceId: id,
        userId: req.user?.id,
      });
      return res.status(404).json({ message: "Service non trouvé" });
    }

    // Vérifier si la nouvelle direction existe
    if (req.body.direction_id) {
      const direction = await Direction.findByPk(req.body.direction_id);
      if (!direction) {
        logger.warn("⚠️ Direction non trouvée", {
          directionId: req.body.direction_id,
          userId: req.user?.id,
        });
        return res.status(404).json({ message: "Direction non trouvée" });
      }
    }

    const oldCopy = oldService.toJSON();
    await oldService.update(req.body);

    const updated = await Service.findByPk(id, {
      include: [{ model: Direction, as: "direction" }],
    });

    logger.info("✅ Service mis à jour avec succès", {
      serviceId: id,
      code: updated.code,
      libelle: updated.libelle,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });

    await HistoriqueService.logUpdate(req, "service", oldCopy, updated);

    res.json(updated);
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      logger.warn("⚠️ Code déjà existant", {
        code: req.body.code,
        userId: req.user?.id,
      });
      return res.status(400).json({ message: "Ce code existe déjà" });
    }

    logger.error("❌ Erreur mise à jour service:", {
      serviceId: id,
      error: err.message,
      stack: err.stack,
      body: req.body,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });
    res
      .status(500)
      .json({ message: "Erreur mise à jour service", error: err.message });
  }
};

/**
 * Supprimer un service
 */
exports.delete = async (req, res) => {
  const startTime = Date.now();
  const { id } = req.params;

  try {
    logger.info("🗑️ Tentative de suppression d'un service", {
      serviceId: id,
      userId: req.user?.id,
    });

    const service = await Service.findByPk(id);
    if (!service) {
      logger.warn("⚠️ Service non trouvé pour suppression", {
        serviceId: id,
        userId: req.user?.id,
      });
      return res.status(404).json({ message: "Service non trouvé" });
    }

    // Vérifier s'il y a des fonctions liées
    const fonctionsCount = await Fonction.count({ where: { service_id: id } });
    if (fonctionsCount > 0) {
      logger.warn("⛔ Impossible de supprimer: des fonctions sont liées", {
        serviceId: id,
        fonctionsCount,
        userId: req.user?.id,
      });
      return res.status(400).json({
        message:
          "Impossible de supprimer ce service car il contient des fonctions",
        count: fonctionsCount,
      });
    }

    // Vérifier s'il y a des types de documents liés
    const typesCount = await TypeDocument.count({ where: { service_id: id } });
    if (typesCount > 0) {
      logger.warn(
        "⛔ Impossible de supprimer: des types de documents sont liés",
        {
          serviceId: id,
          typesCount,
          userId: req.user?.id,
        },
      );
      return res.status(400).json({
        message:
          "Impossible de supprimer ce service car il contient des types de documents",
        count: typesCount,
      });
    }

    await service.destroy();

    logger.info("✅ Service supprimé avec succès", {
      serviceId: id,
      code: service.code,
      libelle: service.libelle,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });

    await HistoriqueService.logDelete(req, "service", service);

    res.json({ message: "Service supprimé avec succès" });
  } catch (err) {
    logger.error("❌ Erreur suppression service:", {
      serviceId: id,
      error: err.message,
      stack: err.stack,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });
    res
      .status(500)
      .json({ message: "Erreur suppression service", error: err.message });
  }
};

/**
 * Récupérer les services d'une direction
 */
exports.getServicesByDirection = async (req, res) => {
  const startTime = Date.now();
  const { directionId } = req.params;

  try {
    logger.debug("🔍 Récupération des services d'une direction", {
      directionId,
      userId: req.user?.id,
    });

    const services = await Service.findAll({
      where: { direction_id: directionId },
      order: [["libelle", "ASC"]],
    });

    logger.info("✅ Services de la direction récupérés", {
      directionId,
      count: services.length,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });

    res.json(services);
  } catch (err) {
    logger.error("❌ Erreur récupération services par direction:", {
      directionId,
      error: err.message,
      stack: err.stack,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });
    res
      .status(500)
      .json({ message: "Erreur récupération services", error: err.message });
  }
};

exports.getFunctionsByService = async (req, res) => {
  const startTime = Date.now();
  const { id } = req.params;

  try {
    logger.debug("🔍 Récupération des fonctions d'une entité niveau 1", {
      serviceId: id,
      userId: req.user?.id,
    });

    const fonctions = await Fonction.findAll({
      where: { service_id: id },
    });

    logger.info("✅ Fonctions récupérées", {
      serviceId: id,
      count: fonctions.length,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });

    res.json(fonctions);
  } catch (err) {
    logger.error("❌ Erreur getFunctionsByService:", {
      serviceId: id,
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
 * Récupérer les services d'une direction
 */

exports.getServicesByDirection = async (req, res) => {
  const startTime = Date.now();
  const { directionId } = req.params;

  try {
    logger.debug("🔍 Récupération des services d'une direction", {
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

    const services = await Service.findAll({
      where: { direction_id: directionId },
      order: [["libelle", "ASC"]],
    });

    logger.info("✅ Services de la direction récupérés", {
      directionId,
      count: services.length,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });

    res.json(services);
  } catch (err) {
    logger.error("❌ Erreur getServicesByDirection:", {
      directionId,
      error: err.message,
      stack: err.stack,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};
