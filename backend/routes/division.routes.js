const express = require("express");
const router = express.Router();
const divisionController = require("../controllers/division.controller");
const { verifyToken } = require("../middlewares/auth.middleware");
const {
  authorizePermission,
} = require("../middlewares/authorizePermission.middleware");

router.post(
  "/",
  verifyToken,
  authorizePermission("division", "create"),
  divisionController.create,
);

router.get(
  "/",
  verifyToken,
  authorizePermission("division", "read"),
  divisionController.findAll,
);

/**
 * @route GET /api/divisions/by-sous-direction/:sousDirectionId
 * @desc Récupérer les divisions d'une sous-direction
 * @access Privé
 */
router.get(
  "/by-sous-direction/:sousDirectionId",
  verifyToken,
  authorizePermission("division", "read"),
  divisionController.getDivisionsBySousDirection,
);

router.get(
  "/:id",
  verifyToken,
  authorizePermission("division", "read"),
  divisionController.findOne,
);

router.get(
  "/:id/fonctions",
  verifyToken,
  authorizePermission("division", "read"),
  divisionController.getFunctionsByDivision,
);

router.get(
  "/:id/sections",
  verifyToken,
  authorizePermission("division", "read"),
  divisionController.getSections,
);

router.put(
  "/:id",
  verifyToken,
  authorizePermission("division", "update"),
  divisionController.update,
);

router.delete(
  "/:id",
  verifyToken,
  authorizePermission("division", "delete"),
  divisionController.delete,
);

module.exports = router;
