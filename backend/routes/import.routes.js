// routes/import.routes.js
const express = require("express");
const router = express.Router();
// const { verifyToken } = require("../middlewares/auth.middleware");
// const {
//   authorizePermission,
// } = require("../middlewares/authorizePermission.middleware");
const importController = require("../controllers/import.controller");

// Importer tous les documents depuis DGCC
router.post(
  "/documents/all",
  // verifyToken,
  // authorizePermission("document", "create"),
  importController.importAllDocumentsFromDGCC,
);

// Importer un document spécifique depuis DGCC
router.post(
  "/documents/:documentId",
  // verifyToken,
  // authorizePermission("document", "create"),
  importController.importDocumentFromDGCC,
);

module.exports = router;
