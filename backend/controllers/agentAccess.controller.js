// controllers/agentEntiteeAccess.controller.js
const {
  AgentEntiteeAccess,
  Agent,
  Direction,
  SousDirection,
  Service,
  Division,
  Section,
} = require("../models");
const logger = require("../config/logger.config");
const HistoriqueService = require("../services/historique.service");

/**
 * Crée un ou plusieurs accès pour un agent
 * Accepte un objet ou un tableau d'objets
 */
exports.grant = async (req, res) => {
  const startTime = Date.now();

  try {
    const payloads = req.body;

    logger.info("📝 Tentative d'ajout d'accès pour agent(s)", {
      userId: req.user?.id,
      count: Array.isArray(payloads) ? payloads.length : 1,
    });

    // Vérifier que c'est un tableau
    if (!Array.isArray(payloads)) {
      logger.warn("⚠️ Payload doit être un tableau", {
        userId: req.user?.id,
      });
      return res
        .status(400)
        .json({ message: "Le payload doit être un tableau" });
    }

    // Valider chaque payload
    for (const p of payloads) {
      if (!p.agent_id) {
        logger.warn("⚠️ agent_id manquant", {
          payload: p,
          userId: req.user?.id,
        });
        return res.status(400).json({
          message: "agent_id est requis pour chaque accès",
        });
      }

      // ✅ MISE À JOUR : Vérifier les nouvelles entités
      if (
        !p.direction_id &&
        !p.sous_direction_id &&
        !p.division_id &&
        !p.section_id &&
        !p.service_id
      ) {
        logger.warn("⚠️ Aucune entité spécifiée", {
          payload: p,
          userId: req.user?.id,
        });
        return res.status(400).json({
          message:
            "Au moins une entité (direction, sous-direction, division, section, service) est requise par accès",
        });
      }
    }

    // ✅ MISE À JOUR : Insertion en masse avec les nouvelles colonnes
    const results = await AgentEntiteeAccess.bulkCreate(
      payloads.map((p) => ({
        agent_id: p.agent_id,
        direction_id: p.direction_id || null,
        sous_direction_id: p.sous_direction_id || null,
        division_id: p.division_id || null,
        section_id: p.section_id || null,
        service_id: p.service_id || null,
        // Garder les anciennes pour compatibilité (optionnel)
        entitee_un_id: null,
        entitee_deux_id: null,
        entitee_trois_id: null,
      })),
      {
        returning: true,
        validate: true,
      },
    );

    // ✅ MISE À JOUR : Recharger avec les nouvelles associations
    const created = await AgentEntiteeAccess.findAll({
      where: { id: results.map((r) => r.id) },
      include: [
        { model: Direction, as: "direction", required: false },
        {
          model: SousDirection,
          as: "sousDirection",
          include: [{ model: Direction, as: "direction" }],
          required: false,
        },
        {
          model: Division,
          as: "division",
          include: [
            {
              model: SousDirection,
              as: "sousDirection",
              include: [{ model: Direction, as: "direction" }],
            },
          ],
          required: false,
        },
        {
          model: Section,
          as: "section",
          include: [
            {
              model: Division,
              as: "division",
              include: [
                {
                  model: SousDirection,
                  as: "sousDirection",
                  include: [{ model: Direction, as: "direction" }],
                },
              ],
            },
          ],
          required: false,
        },
        { model: Service, as: "service", required: false },
      ],
    });

    logger.info("✅ Accès ajoutés avec succès", {
      count: created.length,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });

    // Journalisation dans l'historique
    for (const access of created) {
      await HistoriqueService.logCreate(req, "agentEntiteeAccess", access);
    }

    res.status(201).json(created);
  } catch (err) {
    logger.error("❌ Erreur grant access:", {
      error: err.message,
      stack: err.stack,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });
    res.status(500).json({
      message: "Erreur serveur",
      error: err.message,
    });
  }
};

// Récupérer les accès d'un agent (MIS À JOUR)
exports.agentAccesById = async (req, res) => {
  const startTime = Date.now();
  const { agentId } = req.params;

  try {
    logger.debug("🔍 Récupération des accès d'un agent", {
      agentId,
      userId: req.user?.id,
    });

    const rows = await AgentEntiteeAccess.findAll({
      where: { agent_id: agentId },
      include: [
        { model: Direction, as: "direction", required: false },
        {
          model: SousDirection,
          as: "sousDirection",
          include: [{ model: Direction, as: "direction" }],
          required: false,
        },
        {
          model: Division,
          as: "division",
          include: [
            {
              model: SousDirection,
              as: "sousDirection",
              include: [{ model: Direction, as: "direction" }],
            },
          ],
          required: false,
        },
        {
          model: Section,
          as: "section",
          include: [
            {
              model: Division,
              as: "division",
              include: [
                {
                  model: SousDirection,
                  as: "sousDirection",
                  include: [{ model: Direction, as: "direction" }],
                },
              ],
            },
          ],
          required: false,
        },
        { model: Service, as: "service", required: false },
      ],
    });

    logger.info("✅ Accès de l'agent récupérés", {
      agentId,
      count: rows.length,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });

    res.json(rows);
  } catch (err) {
    logger.error("❌ Erreur récupération accès agent:", {
      agentId,
      error: err.message,
      stack: err.stack,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Révoquer un accès (inchangé)
exports.revoke = async (req, res) => {
  const startTime = Date.now();
  const { id } = req.params;

  try {
    logger.info("🗑️ Tentative de révocation d'un accès", {
      accessId: id,
      userId: req.user?.id,
    });

    if (!id) {
      logger.warn("⚠️ ID manquant pour révocation", {
        userId: req.user?.id,
      });
      return res.status(400).json({ message: "ID requis" });
    }

    const access = await AgentEntiteeAccess.findByPk(id);

    if (!access) {
      logger.warn("⚠️ Accès non trouvé pour révocation", {
        accessId: id,
        userId: req.user?.id,
      });
      return res.status(404).json({
        success: false,
        message: "Accès non trouvé",
        id: id,
      });
    }

    const accessCopy = access.toJSON();

    const deleted = await AgentEntiteeAccess.destroy({
      where: { id },
    });

    if (deleted === 0) {
      logger.warn("⚠️ Aucun accès supprimé", {
        accessId: id,
        userId: req.user?.id,
      });
      return res.status(404).json({
        success: false,
        message: "Aucun accès supprimé",
        id: id,
      });
    }

    logger.info("✅ Accès révoqué avec succès", {
      accessId: id,
      agentId: access.agent_id,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });

    // Journalisation dans l'historique
    await HistoriqueService.logDelete(req, "agentEntiteeAccess", accessCopy);

    res.json({
      success: true,
      message: "Accès révoqué avec succès",
      deleted: deleted,
      id: id,
    });
  } catch (err) {
    logger.error("❌ Erreur révocation accès:", {
      accessId: id,
      error: err.message,
      stack: err.stack,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });
    res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la révocation",
      error: err.message,
    });
  }
};

// Mettre à jour un accès (MIS À JOUR)
exports.update = async (req, res) => {
  const startTime = Date.now();
  const { id } = req.params;

  try {
    logger.info("📝 Tentative de mise à jour d'un accès", {
      accessId: id,
      userId: req.user?.id,
      body: req.body,
    });

    const oldAccess = await AgentEntiteeAccess.findByPk(id);
    if (!oldAccess) {
      logger.warn("⚠️ Accès non trouvé pour mise à jour", {
        accessId: id,
        userId: req.user?.id,
      });
      return res.status(404).json({ message: "Accès introuvable" });
    }

    const oldCopy = oldAccess.toJSON();
    const {
      agent_id,
      direction_id,
      sous_direction_id,
      division_id,
      section_id,
      service_id,
    } = req.body;

    // Mise à jour avec les nouvelles entités
    if (agent_id !== undefined) oldAccess.agent_id = agent_id;
    if (direction_id !== undefined) oldAccess.direction_id = direction_id;
    if (sous_direction_id !== undefined)
      oldAccess.sous_direction_id = sous_direction_id;
    if (division_id !== undefined) oldAccess.division_id = division_id;
    if (section_id !== undefined) oldAccess.section_id = section_id;
    if (service_id !== undefined) oldAccess.service_id = service_id;

    // Validation: au moins une entité
    if (
      !oldAccess.direction_id &&
      !oldAccess.sous_direction_id &&
      !oldAccess.division_id &&
      !oldAccess.section_id &&
      !oldAccess.service_id
    ) {
      logger.warn("⚠️ Aucune entité spécifiée pour mise à jour", {
        accessId: id,
        userId: req.user?.id,
      });
      return res.status(400).json({
        message: "Au moins une entité doit être spécifiée",
      });
    }

    await oldAccess.save();

    // Recharger avec les associations
    const updated = await AgentEntiteeAccess.findByPk(id, {
      include: [
        { model: Direction, as: "direction", required: false },
        {
          model: SousDirection,
          as: "sousDirection",
          include: [{ model: Direction, as: "direction" }],
          required: false,
        },
        {
          model: Division,
          as: "division",
          include: [
            {
              model: SousDirection,
              as: "sousDirection",
              include: [{ model: Direction, as: "direction" }],
            },
          ],
          required: false,
        },
        {
          model: Section,
          as: "section",
          include: [
            {
              model: Division,
              as: "division",
              include: [
                {
                  model: SousDirection,
                  as: "sousDirection",
                  include: [{ model: Direction, as: "direction" }],
                },
              ],
            },
          ],
          required: false,
        },
        { model: Service, as: "service", required: false },
      ],
    });

    logger.info("✅ Accès mis à jour avec succès", {
      accessId: id,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });

    // Journalisation dans l'historique
    await HistoriqueService.logUpdate(
      req,
      "agentEntiteeAccess",
      oldCopy,
      updated,
    );

    res.json(updated);
  } catch (error) {
    logger.error("❌ Erreur mise à jour accès:", {
      accessId: id,
      error: error.message,
      stack: error.stack,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });
    res.status(500).json({ message: "Erreur lors de la mise à jour" });
  }
};

// Lister tous les accès (MIS À JOUR)
exports.list = async (req, res) => {
  const startTime = Date.now();

  try {
    logger.debug("🔍 Récupération de tous les accès", {
      userId: req.user?.id,
      query: req.query,
    });

    const data = await AgentEntiteeAccess.findAll({
      include: [
        { model: Agent, as: "agent" },
        { model: Direction, as: "direction", required: false },
        {
          model: SousDirection,
          as: "sousDirection",
          include: [{ model: Direction, as: "direction" }],
          required: false,
        },
        {
          model: Division,
          as: "division",
          include: [
            {
              model: SousDirection,
              as: "sousDirection",
              include: [{ model: Direction, as: "direction" }],
            },
          ],
          required: false,
        },
        {
          model: Section,
          as: "section",
          include: [
            {
              model: Division,
              as: "division",
              include: [
                {
                  model: SousDirection,
                  as: "sousDirection",
                  include: [{ model: Direction, as: "direction" }],
                },
              ],
            },
          ],
          required: false,
        },
        { model: Service, as: "service", required: false },
      ],
    });

    logger.info("✅ Tous les accès récupérés", {
      count: data.length,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });

    // Journalisation dans l'historique pour les GET avec sidebar
    if (req.headers["x-sidebar-navigation"] === "true") {
      await HistoriqueService.log({
        agent_id: req.user?.id || null,
        action: "read",
        resource: "agentEntiteeAccess",
        resource_id: null,
        resource_identifier: "liste des accès",
        description: "Consultation de la liste des accès",
        method: req.method,
        path: req.originalUrl,
        status: 200,
        ip: req.ip,
        user_agent: req.headers["user-agent"],
        data: {
          count: data.length,
          duration: Date.now() - startTime,
        },
      });
    }

    res.json(data);
  } catch (err) {
    logger.error("❌ Erreur list accès:", {
      error: err.message,
      stack: err.stack,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// controllers/agentEntiteeAccess.controller.js (AJOUTER À LA FIN DU FICHIER)

/**
 * Fonction utilitaire pour récupérer toutes les sous-entités en cascade
 */
const getAllSubEntities = async (entityType, entityId) => {
  const subEntities = [];

  switch (entityType) {
    case "direction":
      // Récupérer les services
      const services = await Service.findAll({
        where: { direction_id: entityId },
      });
      services.forEach((service) => {
        subEntities.push({ type: "service", id: service.id });
      });

      // Récupérer les sous-directions
      const sousDirections = await SousDirection.findAll({
        where: { direction_id: entityId },
      });

      for (const sd of sousDirections) {
        subEntities.push({ type: "sousDirection", id: sd.id });

        // Récupérer les divisions de cette sous-direction
        const divisions = await Division.findAll({
          where: { sous_direction_id: sd.id },
        });

        for (const div of divisions) {
          subEntities.push({ type: "division", id: div.id });

          // Récupérer les sections de cette division
          const sections = await Section.findAll({
            where: { division_id: div.id },
          });
          sections.forEach((section) => {
            subEntities.push({ type: "section", id: section.id });
          });
        }
      }
      break;

    case "sousDirection":
      // Récupérer les divisions
      const divisions = await Division.findAll({
        where: { sous_direction_id: entityId },
      });

      for (const div of divisions) {
        subEntities.push({ type: "division", id: div.id });

        // Récupérer les sections de cette division
        const sections = await Section.findAll({
          where: { division_id: div.id },
        });
        sections.forEach((section) => {
          subEntities.push({ type: "section", id: section.id });
        });
      }
      break;

    case "division":
      // Récupérer les sections
      const sections = await Section.findAll({
        where: { division_id: entityId },
      });
      sections.forEach((section) => {
        subEntities.push({ type: "section", id: section.id });
      });
      break;

    default:
      break;
  }

  return subEntities;
};

/**
 * GRANT ALL SUB ENTITIES - Accorder l'accès à toutes les sous-entités
 * POST /api/agent-access/grant-all-sub-entity
 * Body: { agentId, entityType, entityId }
 */
exports.grantAllSubEntity = async (req, res) => {
  const startTime = Date.now();
  const { agentId, entityType, entityId } = req.body;

  try {
    logger.info("🔑 Tentative d'octroi d'accès à toutes les sous-entités", {
      userId: req.user?.id,
      agentId,
      entityType,
      entityId,
    });

    // Validation
    if (!agentId || !entityType || !entityId) {
      logger.warn("⚠️ Paramètres manquants", {
        agentId,
        entityType,
        entityId,
        userId: req.user?.id,
      });
      return res.status(400).json({
        success: false,
        message: "agentId, entityType et entityId sont requis",
      });
    }

    // Vérifier si l'agent existe
    const agent = await Agent.findByPk(agentId);
    if (!agent) {
      logger.warn("⚠️ Agent non trouvé", { agentId, userId: req.user?.id });
      return res.status(404).json({
        success: false,
        message: "Agent non trouvé",
      });
    }

    // Récupérer toutes les sous-entités
    const subEntities = await getAllSubEntities(entityType, entityId);

    if (subEntities.length === 0) {
      logger.info("ℹ️ Aucune sous-entité trouvée", {
        agentId,
        entityType,
        entityId,
        userId: req.user?.id,
      });
      return res.status(200).json({
        success: true,
        message: "Aucune sous-entité à accorder",
        count: 0,
        accesses: [],
      });
    }

    // Construire le payload pour bulkCreate
    const payload = subEntities.map((sub) => {
      const access = { agent_id: agentId };

      switch (sub.type) {
        case "service":
          access.service_id = sub.id;
          break;
        case "sousDirection":
          access.sous_direction_id = sub.id;
          break;
        case "division":
          access.division_id = sub.id;
          break;
        case "section":
          access.section_id = sub.id;
          break;
      }

      return access;
    });

    // Supprimer les accès existants pour ces entités (éviter les doublons)
    for (const sub of subEntities) {
      const whereCondition = { agent_id: agentId };
      switch (sub.type) {
        case "service":
          whereCondition.service_id = sub.id;
          break;
        case "sousDirection":
          whereCondition.sous_direction_id = sub.id;
          break;
        case "division":
          whereCondition.division_id = sub.id;
          break;
        case "section":
          whereCondition.section_id = sub.id;
          break;
      }

      await AgentEntiteeAccess.destroy({ where: whereCondition });
    }

    // Créer les nouveaux accès
    const results = await AgentEntiteeAccess.bulkCreate(payload, {
      returning: true,
      validate: true,
    });

    // Recharger avec les associations
    const created = await AgentEntiteeAccess.findAll({
      where: { id: results.map((r) => r.id) },
      include: [
        { model: Direction, as: "direction", required: false },
        { model: SousDirection, as: "sousDirection", required: false },
        { model: Division, as: "division", required: false },
        { model: Section, as: "section", required: false },
        { model: Service, as: "service", required: false },
      ],
    });

    logger.info("✅ Accès aux sous-entités accordés avec succès", {
      agentId,
      count: created.length,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });

    // Journalisation
    for (const access of created) {
      await HistoriqueService.logCreate(req, "agentEntiteeAccess", access);
    }

    res.status(201).json({
      success: true,
      message: `${created.length} accès accordés avec succès`,
      count: created.length,
      accesses: created,
    });
  } catch (err) {
    logger.error("❌ Erreur grantAllSubEntity:", {
      error: err.message,
      stack: err.stack,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
      error: err.message,
    });
  }
};

/**
 * REVOKE ALL SUB ENTITIES - Révoquer l'accès à toutes les sous-entités
 * DELETE /api/agent-access/revoke-all-sub-entity
 * Body: { agentId, entityType, entityId }
 */
exports.revokeAllSubEntity = async (req, res) => {
  const startTime = Date.now();
  const { agentId, entityType, entityId } = req.body;

  try {
    logger.info("🗑️ Tentative de révocation des accès aux sous-entités", {
      userId: req.user?.id,
      agentId,
      entityType,
      entityId,
    });

    // Validation
    if (!agentId || !entityType || !entityId) {
      logger.warn("⚠️ Paramètres manquants", {
        agentId,
        entityType,
        entityId,
        userId: req.user?.id,
      });
      return res.status(400).json({
        success: false,
        message: "agentId, entityType et entityId sont requis",
      });
    }

    // Vérifier si l'agent existe
    const agent = await Agent.findByPk(agentId);
    if (!agent) {
      logger.warn("⚠️ Agent non trouvé", { agentId, userId: req.user?.id });
      return res.status(404).json({
        success: false,
        message: "Agent non trouvé",
      });
    }

    // Récupérer toutes les sous-entités
    const subEntities = await getAllSubEntities(entityType, entityId);

    if (subEntities.length === 0) {
      logger.info("ℹ️ Aucune sous-entité trouvée", {
        agentId,
        entityType,
        entityId,
        userId: req.user?.id,
      });
      return res.status(200).json({
        success: true,
        message: "Aucune sous-entité à révoquer",
        count: 0,
      });
    }

    // Récupérer les IDs des accès à supprimer
    const accessIds = [];
    const accessesToDelete = [];

    for (const sub of subEntities) {
      const whereCondition = { agent_id: agentId };
      switch (sub.type) {
        case "service":
          whereCondition.service_id = sub.id;
          break;
        case "sousDirection":
          whereCondition.sous_direction_id = sub.id;
          break;
        case "division":
          whereCondition.division_id = sub.id;
          break;
        case "section":
          whereCondition.section_id = sub.id;
          break;
      }

      const accesses = await AgentEntiteeAccess.findAll({
        where: whereCondition,
      });
      for (const access of accesses) {
        accessIds.push(access.id);
        accessesToDelete.push(access.toJSON());
      }
    }

    if (accessIds.length === 0) {
      logger.info("ℹ️ Aucun accès existant à révoquer", {
        agentId,
        entityType,
        entityId,
        userId: req.user?.id,
      });
      return res.status(200).json({
        success: true,
        message: "Aucun accès existant à révoquer",
        count: 0,
      });
    }

    // Supprimer les accès
    const deleted = await AgentEntiteeAccess.destroy({
      where: { id: accessIds },
    });

    logger.info("✅ Accès aux sous-entités révoqués avec succès", {
      agentId,
      count: deleted,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });

    // Journalisation
    for (const access of accessesToDelete) {
      await HistoriqueService.logDelete(req, "agentEntiteeAccess", access);
    }

    res.json({
      success: true,
      message: `${deleted} accès révoqués avec succès`,
      count: deleted,
    });
  } catch (err) {
    logger.error("❌ Erreur revokeAllSubEntity:", {
      error: err.message,
      stack: err.stack,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
      error: err.message,
    });
  }
};
