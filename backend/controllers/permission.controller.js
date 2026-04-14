// controllers/permission.controller.js
const { Permission } = require("../models");
const logger = require("../config/logger.config");
const HistoriqueService = require("../services/historique.service");

exports.getAllPermissions = async (req, res) => {
  const startTime = Date.now();

  try {
    logger.debug("🔍 Récupération de toutes les permissions", {
      userId: req.user?.id,
    });

    const permissions = await Permission.findAll({
      order: [
        ["resource", "ASC"],
        ["action", "ASC"],
      ],
    });

    logger.info("✅ Permissions récupérées", {
      count: permissions.length,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });

    // Journalisation dans l'historique pour les GET avec sidebar
    if (req.headers["x-sidebar-navigation"] === "true") {
      await HistoriqueService.log({
        agent_id: req.user?.id || null,
        action: "read",
        resource: "permission",
        resource_id: null,
        resource_identifier: "liste des permissions",
        description: "Consultation de la liste des permissions",
        method: req.method,
        path: req.originalUrl,
        status: 200,
        ip: req.ip,
        user_agent: req.headers["user-agent"],
        data: {
          count: permissions.length,
          duration: Date.now() - startTime,
        },
      });
    }

    res.json(permissions);
  } catch (err) {
    logger.error("❌ Erreur getAllPermissions:", {
      error: err.message,
      stack: err.stack,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });
    res.status(500).json({ message: err.message });
  }
};

// controllers/permission.controller.js
const { Permission } = require("../models");
const logger = require("../config/logger.config");
const HistoriqueService = require("../services/historique.service");

exports.getPermissionByID = async (req, res) => {
  const startTime = Date.now();
  const { id } = req.params;

  try {
    logger.debug("🔍 Récupération d'une permission par ID", {
      permissionId: id,
      userId: req.user?.id,
    });

    const permission = await Permission.findByPk(id);

    if (!permission) {
      logger.warn("⚠️ Permission introuvable", {
        permissionId: id,
        userId: req.user?.id,
      });
      return res.status(404).json({ message: "Permission introuvable" });
    }

    logger.info("✅ Permission récupérée", {
      permissionId: id,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });

    // Journalisation dans l'historique
    await HistoriqueService.log({
      agent_id: req.user?.id || null,
      action: "read",
      resource: "permission",
      resource_id: id,
      resource_identifier: `${permission.resource}:${permission.action}`,
      description: `Consultation de la permission ${id}`,
      method: req.method,
      path: req.originalUrl,
      status: 200,
      ip: req.ip,
      user_agent: req.headers["user-agent"],
      data: {
        duration: Date.now() - startTime,
      },
    });

    res.json(permission);
  } catch (err) {
    logger.error("❌ Erreur getPermissionByID:", {
      permissionId: id,
      error: err.message,
      stack: err.stack,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });
    res.status(500).json({ message: "Impossible de récupérer la permission" });
  }
};
