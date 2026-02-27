const express = require("express");
const router = express.Router();
const sectionController = require("../controllers/section.controller");
const { verifyToken } = require("../middlewares/auth.middleware");
const {
  authorizePermission,
} = require("../middlewares/authorizePermission.middleware");

router.post(
  "/",
  verifyToken,
  authorizePermission("section", "create"),
  sectionController.create,
);

router.get(
  "/",
  verifyToken,
  authorizePermission("section", "read"),
  sectionController.findAll,
);

/**
 * @route GET /api/sections/by-division/:divisionId
 * @desc Récupérer les sections d'une division
 * @access Privé
 */
router.get(
  "/by-division/:divisionId",
  verifyToken,
  authorizePermission("section", "read"),
  sectionController.getSectionsByDivision,
);

router.get(
  "/:id/fonctions",
  verifyToken,
  authorizePermission("section", "read"),
  sectionController.getFunctionsBySection,
);

router.get(
  "/:id",
  verifyToken,
  authorizePermission("section", "read"),
  sectionController.findOne,
);

router.put(
  "/:id",
  verifyToken,
  authorizePermission("section", "update"),
  sectionController.update,
);

router.delete(
  "/:id",
  verifyToken,
  authorizePermission("section", "delete"),
  sectionController.delete,
);

module.exports = router;
