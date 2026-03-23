// controllers/statistiques.controller.js
const { sequelize } = require("../models");
const { Agent, Document, TypeDocument } = require("../models");
const logger = require("../config/logger.config");
const HistoriqueService = require("../services/historique.service");

// =============================================
// 1. TOTAUX GLOBAUX
// =============================================

// ➤ Total des agents
exports.getTotalAgents = async (req, res) => {
  const startTime = Date.now();

  try {
    logger.debug("🔍 Récupération du total des agents", {
      userId: req.user?.id,
    });

    const total = await Agent.count();

    logger.info("✅ Total des agents récupéré", {
      total,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });

    res.json({ total });
  } catch (error) {
    logger.error("❌ Erreur getTotalAgents:", {
      error: error.message,
      stack: error.stack,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// ➤ Total des types de documents
exports.getTotalTypesDocument = async (req, res) => {
  const startTime = Date.now();

  try {
    logger.debug("🔍 Récupération du total des types de documents", {
      userId: req.user?.id,
    });

    const total = await TypeDocument.count();

    logger.info("✅ Total des types de documents récupéré", {
      total,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });

    res.json({ total });
  } catch (error) {
    logger.error("❌ Erreur getTotalTypesDocument:", {
      error: error.message,
      stack: error.stack,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// ➤ Total des documents
exports.getTotalDocuments = async (req, res) => {
  const startTime = Date.now();

  try {
    logger.debug("🔍 Récupération du total des documents", {
      userId: req.user?.id,
    });

    const total = await Document.count();

    logger.info("✅ Total des documents récupéré", {
      total,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });

    res.json({ total });
  } catch (error) {
    logger.error("❌ Erreur getTotalDocuments:", {
      error: error.message,
      stack: error.stack,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// =============================================
// 2. AGENTS PAR STRUCTURE (NOUVELLES ENTITÉS)
// =============================================

// ➤ Agents par Direction
exports.getAgentsByDirection = async (req, res) => {
  const startTime = Date.now();

  try {
    logger.debug("🔍 Récupération des agents par direction", {
      userId: req.user?.id,
    });

    const result = await sequelize.query(
      `
      SELECT 
        dir.id as entiteeId,
        dir.libelle as entiteeLibelle,
        dir.code as entiteeCode,
        COUNT(a.id) as nombre
      FROM agent a
      LEFT JOIN fonctions f ON f.id = a.fonction_id
      LEFT JOIN directions dir ON dir.id = f.direction_id
      WHERE f.direction_id IS NOT NULL
      GROUP BY dir.id, dir.libelle, dir.code
      ORDER BY nombre DESC
    `,
      { type: sequelize.QueryTypes.SELECT },
    );

    logger.info("✅ Agents par direction récupérés", {
      count: result.length,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });

    res.json(result);
  } catch (error) {
    logger.error("❌ Erreur getAgentsByDirection:", {
      error: error.message,
      stack: error.stack,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });
    res.status(500).json({ error: "Erreur serveur", details: error.message });
  }
};

// ➤ Agents par Sous-direction
exports.getAgentsBySousDirection = async (req, res) => {
  const startTime = Date.now();

  try {
    logger.debug("🔍 Récupération des agents par sous-direction", {
      userId: req.user?.id,
    });

    const result = await sequelize.query(
      `
      SELECT 
        sd.id as entiteeId,
        sd.libelle as entiteeLibelle,
        sd.code as entiteeCode,
        dir.libelle as directionLibelle,
        COUNT(a.id) as nombre
      FROM agent a
      LEFT JOIN fonctions f ON f.id = a.fonction_id
      LEFT JOIN sous_directions sd ON sd.id = f.sous_direction_id
      LEFT JOIN directions dir ON dir.id = sd.direction_id
      WHERE f.sous_direction_id IS NOT NULL
      GROUP BY sd.id, sd.libelle, sd.code, dir.libelle
      ORDER BY nombre DESC
    `,
      { type: sequelize.QueryTypes.SELECT },
    );

    logger.info("✅ Agents par sous-direction récupérés", {
      count: result.length,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });

    res.json(result);
  } catch (error) {
    logger.error("❌ Erreur getAgentsBySousDirection:", {
      error: error.message,
      stack: error.stack,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// ➤ Agents par Service
exports.getAgentsByService = async (req, res) => {
  const startTime = Date.now();

  try {
    logger.debug("🔍 Récupération des agents par service", {
      userId: req.user?.id,
    });

    const result = await sequelize.query(
      `
      SELECT 
        serv.id as entiteeId,
        serv.libelle as entiteeLibelle,
        serv.code as entiteeCode,
        dir.libelle as directionLibelle,
        COUNT(a.id) as nombre
      FROM agent a
      LEFT JOIN fonctions f ON f.id = a.fonction_id
      LEFT JOIN services serv ON serv.id = f.service_id
      LEFT JOIN directions dir ON dir.id = serv.direction_id
      WHERE f.service_id IS NOT NULL
      GROUP BY serv.id, serv.libelle, serv.code, dir.libelle
      ORDER BY nombre DESC
    `,
      { type: sequelize.QueryTypes.SELECT },
    );

    logger.info("✅ Agents par service récupérés", {
      count: result.length,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });

    res.json(result);
  } catch (error) {
    logger.error("❌ Erreur getAgentsByService:", {
      error: error.message,
      stack: error.stack,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// ➤ Agents par Division
exports.getAgentsByDivision = async (req, res) => {
  const startTime = Date.now();

  try {
    logger.debug("🔍 Récupération des agents par division", {
      userId: req.user?.id,
    });

    const result = await sequelize.query(
      `
      SELECT 
        dvs.id as entiteeId,
        dvs.libelle as entiteeLibelle,
        dvs.code as entiteeCode,
        sd.libelle as sousDirectionLibelle,
        dir.libelle as directionLibelle,
        COUNT(a.id) as nombre
      FROM agent a
      LEFT JOIN fonctions f ON f.id = a.fonction_id
      LEFT JOIN divisions dvs ON dvs.id = f.division_id
      LEFT JOIN sous_directions sd ON sd.id = dvs.sous_direction_id
      LEFT JOIN directions dir ON dir.id = sd.direction_id
      WHERE f.division_id IS NOT NULL
      GROUP BY dvs.id, dvs.libelle, dvs.code, sd.libelle, dir.libelle
      ORDER BY nombre DESC
    `,
      { type: sequelize.QueryTypes.SELECT },
    );

    logger.info("✅ Agents par division récupérés", {
      count: result.length,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });

    res.json(result);
  } catch (error) {
    logger.error("❌ Erreur getAgentsByDivision:", {
      error: error.message,
      stack: error.stack,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// ➤ Agents par Section (CORRIGÉ)
exports.getAgentsBySection = async (req, res) => {
  const startTime = Date.now();

  try {
    logger.debug("🔍 Récupération des agents par section", {
      userId: req.user?.id,
    });

    const result = await sequelize.query(
      `
      SELECT 
        sct.id as entiteeId,
        sct.libelle as entiteeLibelle,
        sct.code as entiteeCode,
        dvs.libelle as divisionLibelle,
        sd.libelle as sousDirectionLibelle,
        dir.libelle as directionLibelle,
        COUNT(a.id) as nombre
      FROM agent a
      LEFT JOIN fonctions f ON f.id = a.fonction_id
      LEFT JOIN sections sct ON sct.id = f.section_id
      LEFT JOIN divisions dvs ON dvs.id = sct.division_id
      LEFT JOIN sous_directions sd ON sd.id = dvs.sous_direction_id
      LEFT JOIN directions dir ON dir.id = sd.direction_id
      WHERE f.section_id IS NOT NULL
      GROUP BY sct.id, sct.libelle, sct.code, dvs.libelle, sd.libelle, dir.libelle
      ORDER BY nombre DESC
    `,
      { type: sequelize.QueryTypes.SELECT },
    );

    logger.info("✅ Agents par section récupérés", {
      count: result.length,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });

    res.json(result);
  } catch (error) {
    logger.error("❌ Erreur getAgentsBySection:", {
      error: error.message,
      stack: error.stack,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// ➤ Agents par structure (tous niveaux confondus) - CORRIGÉ
exports.getAgentsByStructure = async (req, res) => {
  const startTime = Date.now();

  try {
    logger.debug("🔍 Récupération des agents par structure", {
      userId: req.user?.id,
    });

    const result = await sequelize.query(
      `
      SELECT 
        COALESCE(
          sct.libelle, 
          dvs.libelle, 
          sd.libelle, 
          dir.libelle, 
          serv.libelle,
          'Non assigné'
        ) as structureLibelle,
        CASE
          WHEN sct.id IS NOT NULL THEN 'Section'
          WHEN dvs.id IS NOT NULL THEN 'Division'
          WHEN sd.id IS NOT NULL THEN 'Sous-direction'
          WHEN dir.id IS NOT NULL THEN 'Direction'
          WHEN serv.id IS NOT NULL THEN 'Service'
          ELSE 'Sans structure'
        END as typeStructure,
        COUNT(a.id) as nombre
      FROM agent a
      LEFT JOIN fonctions f ON f.id = a.fonction_id
      LEFT JOIN sections sct ON sct.id = f.section_id
      LEFT JOIN divisions dvs ON dvs.id = f.division_id
      LEFT JOIN sous_directions sd ON sd.id = f.sous_direction_id
      LEFT JOIN directions dir ON dir.id = f.direction_id
      LEFT JOIN services serv ON serv.id = f.service_id
      GROUP BY structureLibelle, typeStructure
      ORDER BY nombre DESC
    `,
      { type: sequelize.QueryTypes.SELECT },
    );

    logger.info("✅ Agents par structure récupérés", {
      count: result.length,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });

    res.json(result);
  } catch (error) {
    logger.error("❌ Erreur getAgentsByStructure:", {
      error: error.message,
      stack: error.stack,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// ➤ Documents par structure (CORRIGÉ)
exports.getDocumentsByStructure = async (req, res) => {
  const startTime = Date.now();

  try {
    logger.debug("🔍 Récupération des documents par structure", {
      userId: req.user?.id,
    });

    const result = await sequelize.query(
      `
      SELECT 
        COALESCE(
          td.section_id,
          td.division_id,
          td.sous_direction_id,
          td.direction_id,
          td.service_id,
          0
        ) as entiteeId,
        COALESCE(
          sct.libelle,
          dvs.libelle,
          sd.libelle,
          dir.libelle,
          serv.libelle,
          'Non assigné'
        ) as structureLibelle,
        CASE
          WHEN td.section_id IS NOT NULL THEN 'Section'
          WHEN td.division_id IS NOT NULL THEN 'Division'
          WHEN td.sous_direction_id IS NOT NULL THEN 'Sous-direction'
          WHEN td.direction_id IS NOT NULL THEN 'Direction'
          WHEN td.service_id IS NOT NULL THEN 'Service'
          ELSE 'Sans structure'
        END as typeStructure,
        COUNT(d.id) as nombre
      FROM documents d
      LEFT JOIN typedocuments td ON td.id = d.type_document_id
      LEFT JOIN sections sct ON sct.id = td.section_id
      LEFT JOIN divisions dvs ON dvs.id = td.division_id
      LEFT JOIN sous_directions sd ON sd.id = td.sous_direction_id
      LEFT JOIN directions dir ON dir.id = td.direction_id
      LEFT JOIN services serv ON serv.id = td.service_id
      GROUP BY entiteeId, structureLibelle, typeStructure
      ORDER BY nombre DESC
    `,
      { type: sequelize.QueryTypes.SELECT },
    );

    logger.info("✅ Documents par structure récupérés", {
      count: result.length,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });

    res.json(result);
  } catch (error) {
    logger.error("❌ Erreur getDocumentsByStructure:", {
      error: error.message,
      stack: error.stack,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// =============================================
// 3. STATISTIQUES DOCUMENTS
// =============================================

// ➤ Documents par type
exports.getDocumentsByType = async (req, res) => {
  const startTime = Date.now();

  try {
    logger.debug("🔍 Récupération des documents par type", {
      userId: req.user?.id,
    });

    const result = await sequelize.query(
      `
      SELECT 
        td.nom as typeNom,
        td.code as typeCode,
        COUNT(d.id) as nombre
      FROM documents d
      LEFT JOIN typedocuments td ON td.id = d.type_document_id
      GROUP BY td.id, td.nom, td.code
      ORDER BY nombre DESC
    `,
      { type: sequelize.QueryTypes.SELECT },
    );

    logger.info("✅ Documents par type récupérés", {
      count: result.length,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });

    res.json(result);
  } catch (error) {
    logger.error("❌ Erreur getDocumentsByType:", {
      error: error.message,
      stack: error.stack,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// ➤ Documents créés par mois (derniers 12 mois)
exports.getDocumentsByMonth = async (req, res) => {
  const startTime = Date.now();

  try {
    logger.debug("🔍 Récupération des documents par mois", {
      userId: req.user?.id,
    });

    const result = await sequelize.query(
      `
  SELECT 
    DATE_FORMAT(created_at, '%Y-%m') as mois,
    DATE_FORMAT(MIN(created_at), '%b %Y') as moisLibelle,
    COUNT(*) as nombre
  FROM documents
  WHERE created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
  GROUP BY DATE_FORMAT(created_at, '%Y-%m')
  ORDER BY mois ASC
  `,
      { type: sequelize.QueryTypes.SELECT },
    );

    logger.info("✅ Documents par mois récupérés", {
      count: result.length,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });

    res.json(result);
  } catch (error) {
    logger.error("❌ Erreur getDocumentsByMonth:", {
      error: error.message,
      stack: error.stack,
      userId: req.user?.id,
      duration: Date.now() - startTime,
    });
    res.status(500).json({ error: "Erreur serveur" });
  }
};
