// routes/statistiques.routes.js
const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/auth.middleware");
const {
  authorizePermission,
} = require("../middlewares/authorizePermission.middleware");
const statistiquesController = require("../controllers/statistiques.controller");

// =============================================
// TOTAUX GLOBAUX
// =============================================
router.get(
  "/totaux/agents",
  verifyToken,
  authorizePermission("statistique", "read"),
  statistiquesController.getTotalAgents,
);

router.get(
  "/totaux/types-document",
  verifyToken,
  authorizePermission("statistique", "read"),
  statistiquesController.getTotalTypesDocument,
);

router.get(
  "/totaux/documents",
  verifyToken,
  authorizePermission("statistique", "read"),
  statistiquesController.getTotalDocuments,
);

// =============================================
// AGENTS PAR STRUCTURE (NOUVELLES ENTITÉS)
// =============================================
router.get(
  "/agents/direction",
  verifyToken,
  authorizePermission("statistique", "read"),
  statistiquesController.getAgentsByDirection,
);

router.get(
  "/agents/sous-direction",
  verifyToken,
  authorizePermission("statistique", "read"),
  statistiquesController.getAgentsBySousDirection,
);

router.get(
  "/agents/division",
  verifyToken,
  authorizePermission("statistique", "read"),
  statistiquesController.getAgentsByDivision,
);

router.get(
  "/agents/section",
  verifyToken,
  authorizePermission("statistique", "read"),
  statistiquesController.getAgentsBySection,
);

router.get(
  "/agents/service",
  verifyToken,
  authorizePermission("statistique", "read"),
  statistiquesController.getAgentsByService,
);

router.get(
  "/agents/structure",
  verifyToken,
  authorizePermission("statistique", "read"),
  statistiquesController.getAgentsByStructure,
);

// =============================================
// DOCUMENTS
// =============================================
router.get(
  "/documents/type",
  verifyToken,
  authorizePermission("statistique", "read"),
  statistiquesController.getDocumentsByType,
);

router.get(
  "/documents/mois",
  verifyToken,
  authorizePermission("statistique", "read"),
  statistiquesController.getDocumentsByMonth,
);

router.get(
  "/documents/structure",
  verifyToken,
  authorizePermission("statistique", "read"),
  statistiquesController.getDocumentsByStructure,
);

module.exports = router;
