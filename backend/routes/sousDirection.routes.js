const express = require("express");
const router = express.Router();
const sousDirectionController = require("../controllers/sousDirection.controller");
const { verifyToken } = require("../middlewares/auth.middleware");
const {
  authorizePermission,
} = require("../middlewares/authorizePermission.middleware");

router.post(
  "/",
  verifyToken,
  authorizePermission("sousDirection", "create"),
  sousDirectionController.create,
);

router.get(
  "/",
  verifyToken,
  authorizePermission("sousDirection", "read"),
  sousDirectionController.findAll,
);

/**
 * @route GET /api/sous-directions/by-direction/:directionId
 * @desc Récupérer les sous-directions d'une direction
 * @access Privé
 */
router.get(
  "/by-direction/:directionId",
  verifyToken,
  authorizePermission("sousDirection", "read"),
  sousDirectionController.getSousDirectionsByDirection,
);

router.get(
  "/:id/fonctions",
  verifyToken,
  authorizePermission("sousDirection", "read"),
  sousDirectionController.getFunctionsBySousDirection,
);

router.get(
  "/:id",
  verifyToken,
  authorizePermission("sousDirection", "read"),
  sousDirectionController.findOne,
);

router.get(
  "/:id/divisions",
  verifyToken,
  authorizePermission("sousDirection", "read"),
  sousDirectionController.getDivisions,
);

router.put(
  "/:id",
  verifyToken,
  authorizePermission("sousDirection", "update"),
  sousDirectionController.update,
);

router.delete(
  "/:id",
  verifyToken,
  authorizePermission("sousDirection", "delete"),
  sousDirectionController.delete,
);

module.exports = router;
