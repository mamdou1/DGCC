// routes/service.routes.js
const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/service.controller");
const { verifyToken } = require("../middlewares/auth.middleware");
const {
  authorizePermission,
} = require("../middlewares/authorizePermission.middleware");

/**
 * @route POST /api/services
 * @desc Créer un nouveau service
 * @access Privé
 */
router.post(
  "/",
  verifyToken,
  authorizePermission("service", "create"),
  serviceController.create,
);

/**
 * @route GET /api/services
 * @desc Récupérer tous les services
 * @access Privé
 */
router.get(
  "/",
  verifyToken,
  authorizePermission("service", "read"),
  serviceController.findAll,
);

router.get(
  "/:id/fonctions",
  verifyToken,
  authorizePermission("service", "read"),
  serviceController.getFunctionsByService,
);

/**
 * @route GET /api/services/:id
 * @desc Récupérer un service par son ID
 * @access Privé
 */
router.get(
  "/:id",
  verifyToken,
  authorizePermission("service", "read"),
  serviceController.findOne,
);

/**
 * @route GET /api/services/by-direction/:directionId
 * @desc Récupérer les services d'une direction
 * @access Privé
 */
router.get(
  "/by-direction/:directionId",
  verifyToken,
  authorizePermission("service", "read"),
  serviceController.getServicesByDirection,
);

/**
 * @route PUT /api/services/:id
 * @desc Mettre à jour un service
 * @access Privé
 */
router.put(
  "/:id",
  verifyToken,
  authorizePermission("service", "update"),
  serviceController.update,
);

/**
 * @route DELETE /api/services/:id
 * @desc Supprimer un service
 * @access Privé
 */
router.delete(
  "/:id",
  verifyToken,
  authorizePermission("service", "delete"),
  serviceController.delete,
);

module.exports = router;
